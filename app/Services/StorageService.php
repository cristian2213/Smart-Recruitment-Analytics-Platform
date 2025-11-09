<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class StorageService
{
    /**
     * Available path types for S3 storage
     */
    private const PATH_TYPES = [
        'user.avatar',
        'user.documents',
        'user.temp',
        'application.assets',
        'application.backups',
        'application.logs',
        'system.backups',
        'system.temp',
        'system.cache',
        'public.images',
        'public.downloads',
        'public.media',
    ];

    public function get_full_path(string $relative_path): string
    {
        $storage_url = config('filesystems.disks.s3.endpoint');
        $bucket_name = config('filesystems.disks.s3.bucket');

        return implode('/', [$storage_url, $bucket_name, $relative_path]);
    }

    /**
     * Upload a file to S3 using streaming to handle large files efficiently.
     *
     * @param  UploadedFile  $file  The uploaded file
     * @param  string  $path  The destination path in S3
     * @param  string|null  $disk  The storage disk to use (defaults to 's3')
     * @param  array  $options  Additional options for S3 (e.g., ACL, ContentType)
     * @return string|false The file path if successful, false on failure
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
                return false;
            }

            // Merge default options with provided options
            $options = array_merge([
                'ContentType' => $file->getMimeType(),
                'visibility' => 'private',
            ], $options);

            // Upload using stream
            $success = Storage::disk($disk)->writeStream($path, $stream, $options);

            // Clean up
            if (is_resource($stream)) {
                fclose($stream);
            }

            if (! $success) {
                return false;
            }

            return $this->get_full_path($path);
        } catch (Exception $e) {
            // Clean up on error
            if (isset($stream) && is_resource($stream)) {
                fclose($stream);
            }

            return false;
        }
    }

    /**
     * Download a file from S3 using streaming to handle large files efficiently.
     *
     * @param  string  $path  The file path in S3
     * @param  string|null  $disk  The storage disk to use (defaults to 's3')
     * @return resource|false The file stream if successful, false on failure
     *
     * @throws RuntimeException When the file doesn't exist or cannot be read
     */
    public function download_from_s3(string $path, ?string $disk = 's3')
    {
        try {
            // Check if file exists
            if (! Storage::disk($disk)->exists($path)) {
                throw new RuntimeException("File does not exist: {$path}");
            }

            // Get the file stream
            $stream = Storage::disk($disk)->readStream($path);
            if ($stream === false) {
                throw new RuntimeException("Cannot read file stream for {$path}");
            }

            return $stream;
        } catch (Exception $e) {
            // Clean up on error
            if (isset($stream) && is_resource($stream)) {
                fclose($stream);
            }

            throw $e;
        }
    }

    /**
     * Check if a file exists in the S3 bucket
     *
     * @param  string  $path  The file path in S3
     * @param  string|null  $disk  The storage disk to use (defaults to 's3')
     * @return bool True if the file exists, false otherwise
     *
    //  * @throws Exception When S3 operations fail
     */
    public function file_exists_in_S3(string $path, ?string $disk = 's3'): bool
    {
        try {
            return Storage::disk($disk)->exists($path);
        } catch (Exception $e) {
            return false;
            // throw new Exception("Failed to check file existence: {$e->getMessage()}");
        }
    }

    /**
     * Safely delete a file from S3 if it exists
     *
     * @param  string  $path  The file path in S3
     * @param  string|null  $disk  The storage disk to use (defaults to 's3')
     * @return bool True if the file was deleted or didn't exist, false if deletion failed
     *
    //  * @throws Exception When S3 operations fail
     */
    public function delete_from_s3(string $path, ?string $disk = 's3'): bool
    {
        try {
            // Check if file exists before attempting deletion
            if (! $this->file_exists_in_S3($path, $disk)) {
                return false;
                // throw new Exception("Failed to check file existence: {$path}");
            }

            // Attempt to delete the file
            $deleted = Storage::disk($disk)->delete($path);

            if (! $deleted) {
                return false;
                // throw new Exception("Failed to delete file: {$path}");
            }

            return true;
        } catch (Exception $e) {
            return false;
            // throw new Exception("Error deleting file: {$e->getMessage()}");
        }
    }

    /**
     * Generate a standardized S3 path following the defined structure
     *
     * @param  string  $pathType  The type of path to generate (e.g., 'user.avatar', 'system.backups')
     * @param  array  $params  Additional parameters needed for path generation
     *                         - tenant_id: (optional) For multi-tenant paths
     *                         - user_id: For user-related paths
     *                         - app_name: For application-related paths
     *                         - filename: (optional) The name of the file
     * @return string The generated S3 path
     *
     * @throws \InvalidArgumentException If invalid path type or missing required parameters
     */
    public function generate_s3_path(string $pathType, array $params = []): string
    {
        if (! in_array($pathType, self::PATH_TYPES)) {
            throw new \InvalidArgumentException("Invalid path type: {$pathType}");
        }

        $path = [];

        // Add tenant prefix if provided (for multi-tenant setup)
        if (isset($params['tenant_id'])) {
            $path[] = 'tenants';
            $path[] = $params['tenant_id'];
        }

        // Split path type into main category and subcategory
        [$category, $subcategory] = explode('.', $pathType);

        switch ($category) {
            case 'user':
                if (! isset($params['user_id'])) {
                    throw new \InvalidArgumentException('user_id is required for user paths');
                }
                $path[] = 'users';
                $path[] = $params['user_id'];
                $path[] = $subcategory;
                break;

            case 'application':
                if (! isset($params['app_name'])) {
                    throw new \InvalidArgumentException('app_name is required for application paths');
                }
                $path[] = 'applications';
                $path[] = $params['app_name'];
                $path[] = $subcategory;
                break;

            case 'system':
                $path[] = 'system';
                $path[] = $subcategory;
                break;

            case 'public':
                $path[] = 'public';
                $path[] = $subcategory;
                break;

            default:
                throw new \InvalidArgumentException("Invalid category: {$category}");
        }

        // Add filename if provided
        if (isset($params['filename'])) {
            // Sanitize filename
            $filename = preg_replace('/[^a-zA-Z0-9.-]/', '_', $params['filename']);
            $path[] = $filename;
        }

        // Join path segments and ensure proper formatting
        return implode('/', array_filter($path));
    }
}
