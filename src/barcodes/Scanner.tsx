// Lovingly borrowed (stolen) from https://github.com/ericblade/quagga2-react-example/blob/master/src/components/Scanner.js and tweaked
import React, { useCallback, useLayoutEffect } from 'react'
import Quagga, { QuaggaJSResultObject } from '@ericblade/quagga2'

function getMedian(arr: number[]) {
  arr.sort((a, b) => a - b)
  const half = Math.floor(arr.length / 2)
  if (arr.length % 2 === 1) {
    return arr[half]
  }
  return (arr[half - 1] + arr[half]) / 2
}

function getMedianOfCodeErrors(
  decodedCodes: {
    error?: number
    code: number
    start: number
    end: number
  }[],
) {
  const errors = decodedCodes
    .filter(x => x.error !== undefined)
    .map(x => x.error!)
  return getMedian(errors)
}

export interface ConstraintsSettings {
  width: number
  height: number
}

const defaultConstraints: ConstraintsSettings = {
  width: 640,
  height: 480,
}

export interface LocatorSettings {
  patchSize: 'x-small' | 'small' | 'medium' | 'large' | 'x-large'
  halfSample: boolean
}

const defaultLocatorSettings: LocatorSettings = {
  patchSize: 'medium',
  halfSample: true,
}

const defaultDecoders = ['ean_reader']

export interface Props {
  onDetected: (value: string) => void
  scannerRef: any
  cameraId?: string
  facingMode?: string
  numOfWorkers?: number
  decoders?: string[]
  onScannerReady?: () => void
  constraints?: ConstraintsSettings
  locator?: LocatorSettings
  locate?: boolean
}

const Scanner = ({
  onDetected,
  scannerRef,
  onScannerReady,
  cameraId,
  facingMode,
  constraints = defaultConstraints,
  locator = defaultLocatorSettings,
  numOfWorkers = navigator.hardwareConcurrency || 0,
  decoders = defaultDecoders,
  locate = true,
}: Props) => {
  const errorCheck = useCallback(
    (result: QuaggaJSResultObject) => {
      if (!onDetected) {
        return
      }
      const err = getMedianOfCodeErrors(result.codeResult.decodedCodes)
      // if Quagga is at least 75% certain that it read correctly, then accept the code.
      if (result.codeResult.code && err < 0.25) {
        onDetected(result.codeResult.code)
      }
    },
    [onDetected],
  )
  const handleProcessed = (result: QuaggaJSResultObject) => {
    const drawingCtx = Quagga.canvas.ctx.overlay
    const drawingCanvas = Quagga.canvas.dom.overlay
    drawingCtx.font = '24px Arial'
    drawingCtx.fillStyle = 'green'

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute('width')!),
          parseInt(drawingCanvas.getAttribute('height')!),
        )
        result.boxes
          .filter(box => box !== result.box)
          .forEach(box => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: 'purple',
              lineWidth: 2,
            })
          })
      }
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: 'blue',
          lineWidth: 2,
        })
      }
      if (result.codeResult && result.codeResult.code) {
        // const validated = barcodeValidator(result.codeResult.code);
        // const validated = validateBarcode(result.codeResult.code);
        // Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: validated ? 'green' : 'red', lineWidth: 3 });
        drawingCtx.font = '24px Arial'
        // drawingCtx.fillStyle = validated ? 'green' : 'red';
        // drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);
        drawingCtx.fillText(result.codeResult.code, 10, 20)
        // if (validated) {
        //     onDetected(result);
        // }
      }
    }
  }

  useLayoutEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            ...constraints,
            ...(cameraId && { deviceId: cameraId }),
            ...(!cameraId && { facingMode }),
          },
          target: scannerRef.current,
        },
        locator,
        numOfWorkers,
        frequency: 60,
        decoder: { readers: decoders },
        locate,
      },
      err => {
        Quagga.onProcessed(handleProcessed)

        if (err) {
          return console.log('Error starting Quagga:', err)
        }
        if (scannerRef && scannerRef.current) {
          Quagga.start()
          if (onScannerReady) {
            onScannerReady()
          }
        }
      },
    )
    Quagga.onDetected(errorCheck)
    return () => {
      Quagga.offDetected(errorCheck)
      Quagga.offProcessed(handleProcessed)
      Quagga.stop()
    }
  }, [
    cameraId,
    onDetected,
    onScannerReady,
    scannerRef,
    errorCheck,
    constraints,
    locator,
    decoders,
    locate,
  ])
  return null
}

export default Scanner
