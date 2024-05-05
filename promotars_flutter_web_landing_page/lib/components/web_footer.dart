
import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/apple_download_btn.dart';
import 'package:promotars_flutter_web_landing_page/components/google_download_btn.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_style.dart';
import 'package:promotars_flutter_web_landing_page/utils/image_path.dart';
import 'package:promotars_flutter_web_landing_page/utils/routes.dart';

class WebFooter extends StatelessWidget {
  const WebFooter({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.black,
      width: double.infinity,
      child: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.max,
              children: [
                Row(
                  children: [
                    Text(
                      "Try Now",
                      style: AppStyle.p1Bold
                          .copyWith(color: AppColors.white),
                    ),
                    const SizedBox(width: 30),
                    const GoogleDownloadButton(),
                    const SizedBox(width: 30),
                    const AppleDownloadButton(),
                  ],
                ),
                const SizedBox(width: 100),
                Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    GestureDetector(
                      onTap: () {
                        Navigator.pushNamed(
                            context, AppRoute.termsAndCondition);
                      },
                      child: Text(
                        "Terms And Conditions",
                        style: AppStyle.p1.copyWith(
                          color: AppColors.white,
                          decoration: TextDecoration.underline,
                          decorationColor: AppColors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    GestureDetector(
                      onTap: () {
                        Navigator.pushNamed(
                            context, AppRoute.privacyPolicy);
                      },
                      child: Text(
                        "Privacy Policy",
                        style: AppStyle.p1.copyWith(
                          color: AppColors.white,
                          decoration: TextDecoration.underline,
                          decorationColor: AppColors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 40),
            Text(
              "© ${DateTime.now().year} ${AppConfig.parentCompanyName}. All rights reserved.",
              style: AppStyle.p1.copyWith(color: AppColors.white),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
