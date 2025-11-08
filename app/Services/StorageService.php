<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use League\Flysystem\FilesystemException;

class StorageService
{
     /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Upload a file to S3 using streaming to handle large files efficiently.
     *
     * @param UploadedFile $file The uploaded file
     * @param string $path The destination path in S3
     * @param string|null $disk The storage disk to use (defaults to 's3')
     * @param array $options Additional options for S3 (e.g., ACL, ContentType)
     * @return string|false The file path if successful, false on failure
     *
     * @throws RuntimeException When stream cannot be opened
     * @throws FilesystemException When S3 operations fail
     */
    public function uploadToS3(
        UploadedFile $file,
        string $path,
        ?string $disk = 's3',
        array $options = []
    ): string|false {
        try {
            // Open file stream
            $stream = fopen($file->getRealPath(), 'r');
            if ($stream === false) {
                throw new RuntimeException("Cannot open file stream for {$file->getClientOriginalName()}");
            }

            // Merge default options with provided options
            $options = array_merge([
                'ContentType' => $file->getMimeType(),
                'visibility' => 'private'
            ], $options);

            // Upload using stream
            $success = Storage::disk($disk)->writeStream($path, $stream, $options);

            // Clean up
            if (is_resource($stream)) {
                fclose($stream);
            }

            return $success ? $path : false;
        } catch (\Exception $e) {
            // Clean up on error
            if (isset($stream) && is_resource($stream)) {
                fclose($stream);
            }

            throw $e;
        }
    }

    /**
     * Download a file from S3 using streaming to handle large files efficiently.
     *
     * @param string $path The file path in S3
     * @param string|null $disk The storage disk to use (defaults to 's3')
     * @return resource|false The file stream if successful, false on failure
     *
     * @throws FilesystemException When S3 operations fail
     * @throws RuntimeException When the file doesn't exist or cannot be read
     */
    public function downloadFromS3(string $path, ?string $disk = 's3')
    {
        try {
            // Check if file exists
            if (!Storage::disk($disk)->exists($path)) {
                throw new RuntimeException("File does not exist: {$path}");
            }

            // Get the file stream
            $stream = Storage::disk($disk)->readStream($path);
            if ($stream === false) {
                throw new RuntimeException("Cannot read file stream for {$path}");
            }

            return $stream;
        } catch (\Exception $e) {
            // Clean up on error
            if (isset($stream) && is_resource($stream)) {
                fclose($stream);
            }

            throw $e;
        }
    }
}
