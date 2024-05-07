import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/apple_download_btn.dart';
import 'package:promotars_flutter_web_landing_page/components/google_download_btn.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_style.dart';
import 'package:promotars_flutter_web_landing_page/utils/image_path.dart';
import 'package:promotars_flutter_web_landing_page/utils/responsive.dart';
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
            style: AppStyle.p1(context).copyWith(fontSize: Sizes(10 * 2, 12 * 2, 14 * 2).responsiveValue(context)),
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
                          height: Sizes(60, 80, 100).responsiveValue(context),
                        ),
                      ),
                      const SizedBox(height: 20),
                      GoogleDownloadButton(width: Responsive.isMobile(context) ? 100 : null),
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
                          height: Sizes(60, 80, 100).responsiveValue(context),
                        ),
                      ),
                      const SizedBox(height: 20),
                      AppleDownloadButton(width: Responsive.isMobile(context) ? 100 : null),
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
