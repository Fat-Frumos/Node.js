import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import {pipeline} from "stream/promises";
import fs from "fs";

export async function compressFile(inputPath, outputPath) {
    await pipeline(
        fs.createReadStream(inputPath),
        createBrotliCompress(),
        fs.createWriteStream(outputPath)
    );
}

export async function decompressFile(inputPath, outputPath) {
    await pipeline(
        fs.createReadStream(inputPath),
        createBrotliDecompress(),
        fs.createWriteStream(outputPath)
    );
}

