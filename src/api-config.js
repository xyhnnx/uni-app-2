let obj = {
    // 测试
    test: {
        $filePrefix: 'https://tt.962460.com',
        uploadFileUrl: 'https://tt.962460.com/handler/api/UploadHandler.ashx?method=ProcessRequest',
        apiPrefix: 'http://bsb_test.962460.com'
    },
    // 正式
    prod:{
        $filePrefix: 'https://wy.962460.com',
        uploadFileUrl: 'https://wy.962460.com/handler/api/UploadHandler.ashx?method=ProcessRequest',
        apiPrefix: 'https://zxsh.8002460.com'
    }
}
module.exports = obj['prod']
