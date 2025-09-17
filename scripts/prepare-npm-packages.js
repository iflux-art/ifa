#!/usr/bin/env node

/**
 * 准备 npm 包脚本
 *
 * 此脚本用于准备发布到 npm 的包
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
