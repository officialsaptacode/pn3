//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import { config } from '@workspace/eslint-config/react-internal'

export default [{...tanstackConfig, ...config}]
