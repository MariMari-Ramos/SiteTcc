
<?php
// Função para upload de imagem para Azure Blob Storage
// Requer: composer require microsoft/azure-storage-blob

require_once __DIR__ . '/../vendor/autoload.php';

use MicrosoftAzure\Storage\Blob\BlobRestProxy;
use MicrosoftAzure\Storage\Blob\Models\CreateBlockBlobOptions;

function uploadToAzureBlob($fileTmpPath, $fileName, &$error = null) {
    // Connection string e container
    $connectionString = 'DefaultEndpointsProtocol=https;AccountName=systemforge;AccountKey=+P6SEVBqE8feOuEXEOJAlmZIkF4a+TqIHZ6pTTqh0I78F/HKR2rA4jEomc/06HFHSLTMEWQfKab4+AStTrbIZA==;EndpointSuffix=core.windows.net';
    $containerName = 'profile-image';

    try {
        $blobClient = BlobRestProxy::createBlobService($connectionString);
        $content = fopen($fileTmpPath, "r");
        $options = new CreateBlockBlobOptions();
        $options->setContentType(mime_content_type($fileTmpPath));
        $blobClient->createBlockBlob($containerName, $fileName, $content, $options);
        // URL pública padrão Azure Blob
        $url = "https://systemforge.blob.core.windows.net/$containerName/" . rawurlencode($fileName);
        return $url;
    } catch (Exception $e) {
        $error = $e->getMessage();
        return false;
    }
}
// Função para deletar imagem do Azure Blob Storage
function deleteFromAzureBlob($fileName, &$error = null) {
    $connectionString = 'DefaultEndpointsProtocol=https;AccountName=systemforge;AccountKey=+P6SEVBqE8feOuEXEOJAlmZIkF4a+TqIHZ6pTTqh0I78F/HKR2rA4jEomc/06HFHSLTMEWQfKab4+AStTrbIZA==;EndpointSuffix=core.windows.net';
    $containerName = 'profile-image';
    try {
        $blobClient = BlobRestProxy::createBlobService($connectionString);
        $blobClient->deleteBlob($containerName, $fileName);
        return true;
    } catch (Exception $e) {
        $error = $e->getMessage();
        return false;
    }
}
