/**
 * Smoke test: какая модель Google работает для image generation
 *
 * Запуск: npx ts-node scripts/test-image-models.ts
 */

import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

const API_KEY = process.env.GOOGLE_API_KEY

if (!API_KEY) {
  console.error('❌ GOOGLE_API_KEY not set in environment')
  process.exit(1)
}

const imageModels = [
  'imagen-4.0-generate-001',
  'imagen-4.0-ultra-generate-001',
  'imagen-4.0-fast-generate-001',
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image-preview',
] as const

const testPrompt = `
Generate a professional product hero image for a SaaS landing page.
The image should show: modern UI interface, clean design, professional lighting, 4:3 aspect ratio.
Style: editorial, high-end web design, premium brand quality.
`

const schema = z.object({
  image_url: z.string().url().describe('Generated image URL'),
  model_used: z.string(),
  success: z.boolean(),
})

async function testModel(modelName: string) {
  try {
    console.log(`\n🧪 Testing: ${modelName}`)

    const result = await generateObject({
      model: google(modelName as any),
      schema,
      prompt: testPrompt,
      temperature: 0.7,
    })

    console.log(`✅ ${modelName} works!`)
    console.log(`   Image URL: ${result.object.image_url?.slice(0, 60)}...`)
    return { model: modelName, success: true }
  } catch (error: any) {
    const errorMsg = error?.message || String(error)
    console.log(`❌ ${modelName} failed: ${errorMsg.slice(0, 80)}...`)
    return { model: modelName, success: false, error: errorMsg }
  }
}

async function main() {
  console.log('🎨 Testing Google Image Generation Models\n')
  console.log(`API Key: ${API_KEY.slice(0, 10)}...`)
  console.log(`Total models to test: ${imageModels.length}\n`)

  const results = []

  for (const model of imageModels) {
    const result = await testModel(model)
    results.push(result)

    // Небольшая задержка между тестами
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n📊 RESULTS SUMMARY:')
  console.log('═'.repeat(60))

  const working = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  if (working.length > 0) {
    console.log('\n✅ Working models:')
    working.forEach(r => console.log(`   • ${r.model}`))
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed models:')
    failed.forEach(r => console.log(`   • ${r.model}`))
  }

  console.log('\n💡 RECOMMENDATION:')
  if (working.length > 0) {
    console.log(`Use: ${working[0].model}`)
    console.log(`Update demo-build.ts line 54: model: '${working[0].model}'`)
  } else {
    console.log('No working models found. Check:')
    console.log('1. GOOGLE_API_KEY is valid')
    console.log('2. Account has access to Imagen API')
    console.log('3. Models are available in your region')
  }
}

main().catch(console.error)
