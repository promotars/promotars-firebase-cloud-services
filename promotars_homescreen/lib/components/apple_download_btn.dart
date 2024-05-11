
import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/image_path.dart';
import 'package:url_launcher/url_launcher.dart';

class AppleDownloadButton extends StatelessWidget {
  const AppleDownloadButton({
    super.key,
    required this.width,
  });

  final double? width;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        launchUrl(AppConfig.promotarsiOSAppStoreLink);
      },
      child: Image.asset(
        ImagePath.appleDownload,
        width: width,
      ),
    );
  }
}