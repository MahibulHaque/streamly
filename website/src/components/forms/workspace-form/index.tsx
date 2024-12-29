import React from 'react'
import FormGenerator from '@/components/common/form-generator'
import Loader from '@/components/common/loader'
import { Button } from '@/components/ui/button'
import { useCreateWorkspace } from '@/hooks/useCreateWorkspace'



const WorkspaceForm = () => {
  const { errors, isPending, onFormSubmit, register } = useCreateWorkspace()
  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col gap-y-3"
    >
      <FormGenerator
        register={register}
        name="name"
        placeholder={'Workspace Name'}
        label="Name"
        errors={errors}
        inputType="input"
        type="text"
      />
      <Button
        className="text-sm w-full mt-2"
        type="submit"
        disabled={isPending}
      >
        <Loader state={isPending}>Create Workspace</Loader>
      </Button>
    </form>
  )
}

export default WorkspaceForm