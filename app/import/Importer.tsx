'use client'

import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { Button, TextField } from '@mui/material'
import { importBookInfo } from '@/books/importer/bookImporter'
import { registerBookClient } from '@/api/books'

interface Fields {
  isbn: string
}

export const Importer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({
    defaultValues: { isbn: '9780241470466' },
  })
  const importBook = async (fields: Fields) =>
    toast.promise(
      async () => {
        const book = await importBookInfo(fields.isbn)
        console.log('BOOOOOK', book)
        await registerBookClient(book)
      },
      {
        success: 'Did it',
        pending: 'Doing it',
        error: 'Failed it',
      },
    )

  return (
    <div>
      <form onSubmit={handleSubmit(importBook)}>
        <TextField
          id="isbn"
          error={!!errors?.isbn?.type}
          helperText={errors?.isbn?.message}
          {...register('isbn')}
        />
        <Button type="submit" variant="contained">
          Import
        </Button>
      </form>
      <ToastContainer />
    </div>
  )
}
