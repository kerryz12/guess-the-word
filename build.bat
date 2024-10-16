CALL build_client.bat

set DEST_DIR=..\server\client

if exist "%DEST_DIR%" (
    rmdir /s /q "%DEST_DIR%"
)

mkdir "%DEST_DIR%"

xcopy /e /i /y dist\* "%DEST_DIR%"

echo Build and copy completed!
