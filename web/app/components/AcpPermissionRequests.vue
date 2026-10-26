<script setup lang="ts">
import type { PermissionOption } from '~/types/acp-api'
import { permissionTitle } from '~/utils/acpPermissions'
import type { PendingPermission } from '~/utils/acpPermissions'

defineProps<{
  permissions: PendingPermission[]
}>()

const emit = defineEmits<{
  respondToPermission: [appRequestId: string, option?: PermissionOption]
}>()
</script>

<template>
  <div
    v-if="permissions.length"
    class="border-t border-warning/30 bg-warning/10 px-4 py-3 backdrop-blur"
    role="region"
    aria-live="assertive"
    aria-label="Pending approval requests"
  >
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
      <UCard
        v-for="permission in permissions"
        :key="permission.appRequestId"
        variant="soft"
        :ui="{ body: 'space-y-3' }"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-medium text-highlighted">{{ permissionTitle(permission) }}</p>
            <p class="text-xs text-muted">Hermes is waiting for your approval before continuing.</p>
          </div>
          <UBadge color="warning" variant="soft" size="sm">Permission</UBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="option in permission.request.options"
            :key="option.optionId"
            size="sm"
            :color="option.kind.startsWith('allow') ? 'primary' : 'neutral'"
            :variant="option.kind.startsWith('allow') ? 'solid' : 'soft'"
            @click="emit('respondToPermission', permission.appRequestId, option)"
          >
            {{ option.name }}
          </UButton>
          <UButton
            size="sm"
            color="neutral"
            variant="ghost"
            @click="emit('respondToPermission', permission.appRequestId)"
          >
            Cancel
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
