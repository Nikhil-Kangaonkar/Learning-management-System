package com.eskill.lms.service;

import com.eskill.lms.model.FileEntity;
import com.eskill.lms.repository.FileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public FileEntity storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Uploaded file is empty!");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file physically
        Path filePath = uploadPath.resolve(file.getOriginalFilename());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save file metadata in DB
        FileEntity fileEntity = new FileEntity(file.getOriginalFilename(), filePath.toString());
        return fileRepository.save(fileEntity);
    }

    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }
}
