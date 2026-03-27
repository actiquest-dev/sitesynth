import { defineEventHandler, readBody } from 'h3'
import { experimental_generateImage as generateImage } from 'ai'
import { google } from '@ai-sdk/google'
import { getDemoBuildToken } from '~~/server/utils/demo-build-token'

const mimeToExtension = (mediaType: string) => {
  if (mediaType === 'image/png') return 'png'
  if (mediaType === 'image/jpeg') return 'jpg'
  if (mediaType === 'image/webp') return 'webp'
  return 'bin'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token

  if (token !== getDemoBuildToken()) {
    return { success: false, error: 'Unauthorized' }
  }

  const buildContract = body?.buildContract || {}
  const project = buildContract?.project || {}
  const targetUrl = String(project?.targetUrl || '').replace(/\/+$/, '')
  const assetRequirements = Array.isArray(buildContract?.designContract?.asset_requirements)
    ? buildContract.designContract.asset_requirements
    : []

  if (assetRequirements.length === 0) {
    return {
      success: true,
      data: {
        assetManifest: { assets: [] },
        generatedAssets: [],
      },
    }
  }

  const generatedAssets = []
  const assetManifest = { assets: [] as any[] }

  for (const requirement of assetRequirements) {
    const modelId = String(requirement?.model || buildContract?.executor?.assetGeneration?.model || 'nano-banana-pro-preview')
    const outputPath = String(requirement?.output_path || `assets/${requirement?.id || 'asset'}.webp`)
    const alt = String(requirement?.alt || requirement?.purpose || requirement?.id || 'Generated image')

    const result = await generateImage({
      model: google.image(modelId),
      prompt: String(requirement?.style_prompt || requirement?.prompt || alt),
      n: 1,
      aspectRatio: typeof requirement?.aspect_ratio === 'string' ? requirement.aspect_ratio : undefined,
      size: typeof requirement?.size === 'string' ? requirement.size : undefined,
    })

    const image = result.image
    const fileName = outputPath.split('/').pop() || `asset.${mimeToExtension(image.mediaType)}`

    generatedAssets.push({
      id: requirement?.id || fileName,
      path: outputPath,
      file_name: fileName,
      media_type: image.mediaType,
      data_base64: image.base64,
      alt,
      prompt: requirement?.style_prompt || requirement?.prompt || null,
    })

    assetManifest.assets.push({
      id: requirement?.id || fileName,
      path: outputPath,
      public_url: targetUrl ? `${targetUrl}/${outputPath.replace(/^\/+/, '')}` : null,
      media_type: image.mediaType,
      alt,
      prompt: requirement?.style_prompt || requirement?.prompt || null,
    })
  }

  return {
    success: true,
    data: {
      assetManifest,
      generatedAssets,
    },
  }
})
