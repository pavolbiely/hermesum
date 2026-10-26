import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { after, test } from 'node:test'

const tempModules = []
const modulePromise = loadModule()

after(async () => {
  await Promise.all(tempModules.map(path => rm(path, { recursive: true, force: true }).catch(() => undefined)))
})

async function loadModule() {
  const sourcePath = resolve('app/utils/acpPermissions.ts')
  const tempPath = resolve(tmpdir(), `hermesum-acpPermissions.${process.pid}.${randomUUID()}.ts`)
  tempModules.push(tempPath)

  let source = await readFile(sourcePath, 'utf8')
  source = source.replace("import type { RequestPermissionRequest } from '~/types/acp-api'\n", '')
  await mkdir(dirname(tempPath), { recursive: true })
  await writeFile(tempPath, source, 'utf8')
  return import(pathToFileURL(tempPath).href)
}

function permission(toolCall) {
  return {
    appRequestId: 'request-1',
    request: {
      sessionId: 'session-1',
      toolCall,
      options: []
    }
  }
}

test('permission title prefers explicit tool title', async () => {
  const { permissionTitle } = await modulePromise
  assert.equal(permissionTitle(permission({ title: 'Run shell command', name: 'terminal' })), 'Run shell command')
})

test('permission title falls back through tool fields', async () => {
  const { permissionTitle } = await modulePromise
  assert.equal(permissionTitle(permission({ name: 'terminal' })), 'terminal')
  assert.equal(permissionTitle(permission({ kind: 'execute' })), 'execute')
  assert.equal(permissionTitle(permission({ toolCallId: 'tool-123' })), 'tool-123')
})

test('permission title uses generic fallback when tool metadata is absent', async () => {
  const { permissionTitle } = await modulePromise
  assert.equal(permissionTitle(permission({ title: '' })), 'Permission required')
})
