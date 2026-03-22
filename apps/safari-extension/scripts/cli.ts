import cac from 'cac'
import { build } from 'tsdown'
import { execa } from 'execa'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const buildExtension = async () => {
  console.log('Building extension scripts...')
  await build()
}

const buildPages = async () => {
  console.log('Building Vue pages...')
  await execa('vite', ['build'], {
    cwd: __dirname,
    stdio: 'inherit',
  })
}

const copyAssets = async () => {
  console.log('Copying assets...')

  const distDir = path.resolve(__dirname, 'dist')
  const resourcesDir = path.resolve(
    __dirname,
    '../safari-extension-app/CloudDocumentConverter Extension/Resources'
  )

  await fs.mkdir(resourcesDir, { recursive: true })

  await fs.cp(
    path.resolve(distDir, 'bundles'),
    path.resolve(resourcesDir, 'bundles'),
    { recursive: true }
  )

  await fs.cp(
    path.resolve(distDir, 'pages'),
    path.resolve(resourcesDir, 'pages'),
    { recursive: true }
  )

  await fs.cp(
    path.resolve(__dirname, 'images'),
    path.resolve(resourcesDir, 'images'),
    { recursive: true }
  )

  await fs.cp(
    path.resolve(__dirname, '_locales'),
    path.resolve(resourcesDir, '_locales'),
    { recursive: true }
  )

  await fs.copyFile(
    path.resolve(__dirname, 'manifest.json'),
    path.resolve(resourcesDir, 'manifest.json')
  )

  console.log('Assets copied successfully!')
}

const buildXcodeProject = async () => {
  console.log('Building Xcode project...')

  const projectPath = path.resolve(
    __dirname,
    '../safari-extension-app/CloudDocumentConverter.xcodeproj'
  )

  try {
    await execa('xcodebuild', [
      '-project',
      projectPath,
      '-scheme',
      'CloudDocumentConverter',
      '-configuration',
      'Release',
      '-derivedDataPath',
      path.resolve(__dirname, 'build'),
    ], {
      cwd: path.resolve(__dirname, '../safari-extension-app'),
      stdio: 'inherit',
    })

    console.log('Xcode build completed!')
  } catch (error) {
    console.error('Xcode build failed. Make sure Xcode is installed.')
    throw error
  }
}

const cli = cac()

cli
  .command('build', 'Build Safari extension')
  .action(async () => {
    try {
      await buildExtension()
      await buildPages()
      await copyAssets()
      console.log('Safari extension build complete!')
    } catch (error) {
      console.error('Build failed:', error)
      process.exit(1)
    }
  })

cli
  .command('build:xcode', 'Build Xcode project (requires Xcode)')
  .action(async () => {
    try {
      await buildXcodeProject()
    } catch (error) {
      console.error('Xcode build failed:', error)
      process.exit(1)
    }
  })

cli
  .command('copy', 'Copy built assets to Safari extension resources')
  .action(async () => {
    try {
      await copyAssets()
    } catch (error) {
      console.error('Copy failed:', error)
      process.exit(1)
    }
  })

cli.parse()
