import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/download_app_btn.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/image_path.dart';
import 'package:promotars_flutter_web_landing_page/utils/routes.dart';

class WebAppBar extends StatelessWidget {
  const WebAppBar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.primary,
      height: 80,
      padding: const EdgeInsets.symmetric(
        horizontal: AppConfig.contentPadding,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        children: [
          GestureDetector(
            onTap: (){
              String route = ModalRoute.of(context)?.settings.name ?? "";
              bool alreadyInHomeScreen = route == AppRoute.home;
              if(!alreadyInHomeScreen) Navigator.pushNamed(context, AppRoute.home);
            },
            child: Row(
              children: [
                Image.asset(
                  ImagePath.appLogo,
                  height: 60,
                ),
                Image.asset(
              ImagePath.appLogoText,
              width: 100,
            ),
              ],
            ),
          ),
          
          const Spacer(),
          const DownloadAppButton(),
        ],
      ),
    );
  }
}