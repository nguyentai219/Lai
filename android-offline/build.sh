#!/bin/sh
# Đóng gói APK "Lãi Suất" chạy OFFLINE (WebView + toàn bộ web app nằm sẵn trong APK).
#   apt-get install android-sdk-platform-23 aapt apksigner zipalign dalvik-exchange
# Cách dùng (WEB_DIR mặc định là thư mục repo): KEYSTORE=/đường/dẫn/lai.keystore KS_PASS=... ./build.sh
# Mỗi lần sửa web phải build lại APK (tăng versionCode trong AndroidManifest.xml) và ký bằng ĐÚNG khoá cũ.
set -e
cd "$(dirname "$0")"
SDK_JAR=/usr/lib/android-sdk/platforms/android-23/android.jar
WEB_DIR="${WEB_DIR:-..}"
: "${KEYSTORE:?Cần KEYSTORE}" "${KS_PASS:?Cần KS_PASS}"
rm -rf build && mkdir -p build/gen build/classes build/assets/www
cp -R "$WEB_DIR"/index.html "$WEB_DIR"/manifest.json "$WEB_DIR"/*.png "$WEB_DIR"/fonts build/assets/www/
aapt package -f -m -J build/gen -M AndroidManifest.xml -S res -A build/assets -I "$SDK_JAR" -F build/app.unsigned.apk
javac -nowarn -source 8 -target 8 -bootclasspath "$SDK_JAR" -d build/classes \
  $(find src build/gen -name '*.java')
dalvik-exchange --dex --output=build/classes.dex build/classes
(cd build && aapt add app.unsigned.apk classes.dex >/dev/null)
zipalign -f 4 build/app.unsigned.apk build/app.aligned.apk
apksigner sign --ks "$KEYSTORE" --ks-pass "pass:$KS_PASS" --out build/LaiSuat.apk build/app.aligned.apk
apksigner verify build/LaiSuat.apk && echo "OK: build/LaiSuat.apk"
