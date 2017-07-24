!macro customInstall
  SetOutPath $APPDATA
  File "${BUILD_RESOURCES_DIR}/user-settings.json"
!macroend