import React from 'react'
import { getNotifications, onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getWorkspaces, verifyAccessToWorkspace } from '@/actions/workspace'
import Header from '@/components/common/header'
import Sidebar from '@/components/common/sidebar'

type Props = {
  params: { workspaceId: string }
  children: React.ReactNode
}

const Layout = async ({ params: { workspaceId }, children }: Props) => {
  const auth = await onAuthenticateUser()
  if (!auth.user?.workspace) redirect('/auth/sign-in')
  if (!auth.user.workspace.length) redirect('/auth/sign-in')
  const hasAccess = await verifyAccessToWorkspace(workspaceId)

  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`)
  }

  if (!hasAccess.data?.workspace) return null

  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getWorkspaces(),
  })

  await query.prefetchQuery({
    queryKey: ['user-notifications'],
    queryFn: () => getNotifications(),
  })



  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <Header workspace={hasAccess.data.workspace} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout