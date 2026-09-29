import type { RequestPermissionRequest } from '~/types/acp-api'

export type PendingPermission = {
  appRequestId: string
  request: RequestPermissionRequest
}

export function permissionTitle(permission: PendingPermission) {
  const toolCall = permission.request.toolCall as Record<string, unknown>
  const value = toolCall.title ?? toolCall.name ?? toolCall.kind ?? toolCall.toolCallId
  return typeof value === 'string' && value ? value : 'Permission required'
}
