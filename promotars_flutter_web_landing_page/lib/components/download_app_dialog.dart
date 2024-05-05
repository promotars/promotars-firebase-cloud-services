import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/apple_download_btn.dart';
import 'package:promotars_flutter_web_landing_page/components/google_download_btn.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_style.dart';
import 'package:promotars_flutter_web_landing_page/utils/image_path.dart';
import 'package:url_launcher/url_launcher.dart';

class DownloadAppDialog extends StatelessWidget {
  const DownloadAppDialog({
    super.key,
    required this.text,
  });

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 360,
      width: 430,
      color: AppColors.white,
      child: Column(
        children: [
          Align(
            alignment: Alignment.bottomRight,
            child: Container(
              margin: const EdgeInsets.all(10),
              child: IconButton(
                icon: const Icon(Icons.close),
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
            ),
          ),
          Text(
            text,
            style: AppStyle.p1.copyWith(fontSize: 25),
          ),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.all(40),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                GestureDetector(
                  onTap: () {
                    launchUrl(AppConfig.promotarsAndriodAppStoreLink);
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.asset(
                          ImagePath.appLogo,
                          height: 100,
                        ),
                      ),
                      const SizedBox(height: 20),
                      GoogleDownloadButton(),
                    ],
                  ),
                ),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  height: 150,
                  width: 1,
                  color: AppColors.black,
                ),
                GestureDetector(
                  onTap: () {
                    launchUrl(AppConfig.promotarsiOSAppStoreLink);
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.asset(
                          ImagePath.appLogo,
                          height: 100,
                        ),
                      ),
                      const SizedBox(height: 20),
                      AppleDownloadButton(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
