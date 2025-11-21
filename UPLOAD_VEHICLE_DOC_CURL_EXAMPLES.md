# Upload Vehicle Document - cURL Examples

This document contains cURL examples for uploading all types of vehicle documents.

## Endpoint

```
POST https://digivahan.in/api/upload_vehicle_doc
```

## Authentication

No Authentication Required

---

## 1. Upload Registration Document (RC)

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=registration" \
  -F "doc_file=@/path/to/registration_document.pdf"
```

**Alternative with phone number:**

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=7404238772" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=registration" \
  -F "doc_file=@/path/to/registration_document.pdf"
```

---

## 2. Upload Insurance Document

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=insurance" \
  -F "doc_file=@/path/to/insurance_document.pdf"
```

**With image file:**

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=insurance" \
  -F "doc_file=@/path/to/insurance_document.jpg"
```

---

## 3. Upload Pollution Certificate

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=pollution" \
  -F "doc_file=@/path/to/pollution_certificate.pdf"
```

**With PNG image:**

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=pollution" \
  -F "doc_file=@/path/to/pollution_certificate.png"
```

---

## 4. Upload Fitness Certificate

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=fitness" \
  -F "doc_file=@/path/to/fitness_certificate.pdf"
```

**With JPEG image:**

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=fitness" \
  -F "doc_file=@/path/to/fitness_certificate.jpg"
```

---

## 5. Upload Permit Document

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=permit" \
  -F "doc_file=@/path/to/permit_document.pdf"
```

**With image file:**

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=permit" \
  -F "doc_file=@/path/to/permit_document.png"
```

---

## 6. Upload Other Documents (e.g., Aadhar)

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=other" \
  -F "doc_name=Adhar" \
  -F "doc_number=1234 5678 9012" \
  -F "doc_file=@/path/to/aadhar_document.pdf"
```

**With image file:**

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=other" \
  -F "doc_name=Adhar" \
  -F "doc_number=1234 5678 9012" \
  -F "doc_file=@/path/to/aadhar_document.jpg"
```

---

## 7. Upload Other Documents - Driver License

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=other" \
  -F "doc_name=Driver License" \
  -F "doc_number=DL-1234567890" \
  -F "doc_file=@/path/to/driver_license.pdf"
```

---

## 8. Upload Other Documents - PAN Card

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=other" \
  -F "doc_name=PAN Card" \
  -F "doc_number=ABCDE1234F" \
  -F "doc_file=@/path/to/pan_card.pdf"
```

---

## 9. Upload Other Documents - Passport

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=other" \
  -F "doc_name=Passport" \
  -F "doc_number=A1234567" \
  -F "doc_file=@/path/to/passport.pdf"
```

---

## Request Parameters

| Parameter    | Type   | Required    | Description                                                                                                                                                |
| ------------ | ------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user_id`    | string | Yes         | User's email address or phone number                                                                                                                       |
| `vehicle_id` | string | Yes         | Vehicle number (e.g., UP32AB1234)                                                                                                                          |
| `doc_type`   | enum   | Yes         | Document type: `vehicle_doc` or `other`                                                                                                                    |
| `doc_name`   | string | Yes         | For `vehicle_doc`: `registration`, `insurance`, `pollution`, `fitness`, `permit`<br>For `other`: Any document name (e.g., `Adhar`, `Driver License`, etc.) |
| `doc_number` | string | Conditional | Required only when `doc_type` is `other`                                                                                                                   |
| `doc_file`   | file   | Yes         | Document file (PDF, JPEG, or PNG)                                                                                                                          |

---

## Valid Document Types

### Vehicle Documents (`doc_type=vehicle_doc`)

- `registration` - Registration Certificate (RC)
- `insurance` - Insurance Document
- `pollution` - Pollution Certificate
- `fitness` - Fitness Certificate
- `permit` - Permit Document

### Other Documents (`doc_type=other`)

- Any custom document name (e.g., `Adhar`, `Driver License`, `PAN Card`, `Passport`, etc.)
- Requires `doc_number` parameter

---

## Supported File Types

- **Images**: JPEG (`.jpg`, `.jpeg`), PNG (`.png`)
- **Documents**: PDF (`.pdf`)

---

## Success Response

```json
{
  "status": true,
  "message": "Document has been uploaded and reference has been shared in the garage succesfully."
}
```

---

## Error Responses

### Invalid Vehicle Number

```json
{
  "status": false,
  "message": "Vehicle number you have enter does not exist in your garage."
}
```

### Invalid User ID

```json
{
  "status": false,
  "message": "Invalid user id."
}
```

### Upload Failed

```json
{
  "status": false,
  "message": "Doc is not uploaded please try again."
}
```

### Invalid Parameters

```json
{
  "status": false,
  "message": "You have entered invalid parameter"
}
```

---

## Notes

1. **File Path**: Replace `/path/to/your/document.pdf` with the actual file path on your system
2. **User ID**: Can be either email address or phone number (without country code)
3. **Vehicle ID**: Must match the vehicle number already added to the user's garage
4. **Document Number**: Only required for `other` type documents
5. **File Size**: Check the maximum file size limit configured in your system

---

## Testing with Different Vehicles

### Vehicle 1: UP32AB1236

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1236" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=registration" \
  -F "doc_file=@/path/to/document.pdf"
```

### Vehicle 2: UP32AB1234

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=insurance" \
  -F "doc_file=@/path/to/document.pdf"
```

### Vehicle 3: UP32AB1235

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1235" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=pollution" \
  -F "doc_file=@/path/to/document.pdf"
```

---

## Quick Test Commands

### Test Registration Document

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=registration" \
  -F "doc_file=@registration.pdf"
```

### Test Insurance Document

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=7404238772" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=vehicle_doc" \
  -F "doc_name=insurance" \
  -F "doc_file=@insurance.pdf"
```

### Test Aadhar Document

```bash
curl -X POST https://digivahan.in/api/upload_vehicle_doc \
  -F "user_id=sumitsaini576@gmail.com" \
  -F "vehicle_id=UP32AB1234" \
  -F "doc_type=other" \
  -F "doc_name=Adhar" \
  -F "doc_number=1234 5678 9012" \
  -F "doc_file=@aadhar.pdf"
```
