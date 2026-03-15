<?php

namespace App\Http\Controllers;

abstract class Controller
{

    protected function fileUpload($file, $path)
    {
        $fileName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
        $file->move(public_path($path), $fileName);
        return "$path/$fileName";
    }

    protected function fileDelete($filePath)
    {
        if (empty($filePath)) {
            return false;
        }
        $fullPath = public_path($filePath);

        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return false;
    }
}
