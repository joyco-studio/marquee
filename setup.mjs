import { promises as fs } from 'fs'
import { createInterface } from 'readline'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { builtinModules } from 'node:module'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

const banner = `
██╗     ██╗██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗
██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
██║     ██║██████╔╝██████╔╝███████║██████╔╝ ╚████╔╝ 
██║     ██║██╔══██╗██╔══██╗██╔══██║██╔══██╗  ╚██╔╝  
███████╗██║██████╔╝██║  ██║██║  ██║██║  ██║   ██║   
╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
                                                      
████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗
╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝
   ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  
   ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  
   ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗
   ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
`

const scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
const blacklist = ['node_modules', 'favicon.ico']

function validatePackageName(name) {
  const errors = []

  if (name === null) {
    errors.push('Package name cannot be null')
    return { valid: false, errors }
  }

  if (name === undefined) {
    errors.push('Package name cannot be undefined')
    return { valid: false, errors }
  }

  if (typeof name !== 'string') {
    errors.push('Package name must be a string')
    return { valid: false, errors }
  }

  if (!name.length) {
    errors.push('Package name length must be greater than zero')
  }

  if (name.match(/^\./)) {
    errors.push('Package name cannot start with a period')
  }

  if (name.match(/^_/)) {
    errors.push('Package name cannot start with an underscore')
  }

  if (name.trim() !== name) {
    errors.push('Package name cannot contain leading or trailing spaces')
  }

  // Check blacklist
  blacklist.forEach((blacklistedName) => {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(`${blacklistedName} is a blacklisted name`)
    }
  })

  // Check for core module names
  if (builtinModules.includes(name.toLowerCase())) {
    errors.push(`${name} is a core module name`)
  }

  if (name.length > 214) {
    errors.push('Package name cannot be longer than 214 characters')
  }

  // Check for mixed case
  if (name.toLowerCase() !== name) {
    errors.push('Package name must be lowercase')
  }

  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    errors.push('Package name cannot contain special characters ("~\'!()*")')
  }

  if (encodeURIComponent(name) !== name) {
    // Check if it's a scoped package name, like @user/package
    const nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      const user = nameMatch[1]
      const pkg = nameMatch[2]
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return { valid: true }
      }
    }

    errors.push('Package name can only contain URL-friendly characters')
  }

  return { valid: errors.length === 0, errors: errors.length ? errors : undefined }
}

async function main() {
  console.log(banner)
  console.log('\nWelcome to the Library Template initialization!\n')

  // Ask for library name
  let isValidName = false
  let libraryName
  while (!isValidName) {
    libraryName = await question("What's your library's name? ")
    const validation = validatePackageName(libraryName)
    if (validation.valid) {
      isValidName = true
    } else {
      console.error('\nInvalid package name. Errors:')
      validation.errors.forEach((error) => {
        console.error(`- ${error}`)
      })
      console.log('')
    }
  }

  // Ask for package description
  const packageDescription = await question('\nEnter a description for your library: ')

  // Ask about PR preview
  const enablePrPreview = (await question('\nSet up PR and commit automatic package preview? (yes/no) '))
    .toLowerCase()
    .startsWith('y')

  // Ask about automatic release
  const enableAutoRelease = (await question('\nSet up automatic package changeset release and publish? (yes/no) '))
    .toLowerCase()
    .startsWith('y')

  // Show confirmation
  console.log('\nPlease confirm the following changes:')
  console.log(`- Package name will be set to: ${libraryName}`)
  console.log(`- Package description: ${packageDescription}`)
  console.log(`- PR preview publishing will be: ${enablePrPreview ? 'ENABLED' : 'DISABLED'}`)
  console.log(`- Automatic release will be: ${enableAutoRelease ? 'ENABLED' : 'DISABLED'}`)

  const confirm = await question('\nProceed with these changes? (yes/no) ')

  if (!confirm.toLowerCase().startsWith('y')) {
    console.log('Initialization cancelled.')
    process.exit(0)
  }

  // Apply changes
  try {
    // Update package.json
    const packageJsonPath = join(__dirname, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    packageJson.name = libraryName
    packageJson.description = packageDescription
    packageJson.version = '0.0.0'
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

    // Handle workflow files
    if (enablePrPreview) {
      await fs.rename(
        join(__dirname, '.github/workflows/publish-any-commit.yml.disabled'),
        join(__dirname, '.github/workflows/publish-any-commit.yml')
      )
    }

    if (enableAutoRelease) {
      await fs.rename(
        join(__dirname, '.github/workflows/release.yml.disabled'),
        join(__dirname, '.github/workflows/release.yml')
      )
    }

    // Delete .changeset folder and CHANGELOG.md
    await fs.rm(join(__dirname, '.changeset'), { recursive: true, force: true })
    await fs.rm(join(__dirname, 'CHANGELOG.md'), { force: true })

    // Install dependencies
    console.log('\nInstalling dependencies...')
    const { stdout, stderr } = await execAsync('pnpm install', { stdio: 'inherit' })
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)

    // Remove setup script from package.json
    delete packageJson.scripts['setup:template']
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

    // Self-destruct this file
    await fs.unlink(__filename)

    console.log('\nInitialization completed successfully! 🎉')
  } catch (error) {
    console.error('Error applying changes:', error)
    process.exit(1)
  }

  rl.close()
}

main().catch(console.error)
