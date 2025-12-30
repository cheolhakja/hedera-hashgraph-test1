package com.hedera1.demo;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final HederaService hederaService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 파일 정보 추출
            String fileHash = "sha256-" + System.currentTimeMillis(); // 수정 필요: 실제 해시 계산 로직으로
            long fileSize = file.getSize(); // 바이트 단위


            // 블록체인 등록
            String result = hederaService.registerImageOnBlockchain(fileHash, fileSize);

            // DB에 이미지를 저장하는 로직이 들어가야함



            return ResponseEntity.ok("정산 트랜잭션 결과: " + result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("오류 발생: " + e.getMessage());
        }
    }
}