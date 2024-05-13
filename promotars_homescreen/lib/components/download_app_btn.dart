import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/download_app_dialog.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_style.dart';
import 'package:promotars_flutter_web_landing_page/utils/responsive.dart';
class DownloadAppButton extends StatelessWidget {
  const DownloadAppButton({
    super.key,
    this.invertColor = false,
    this.text = "Download App",
  });

  final bool invertColor;
  final String text;

  Color get _color => invertColor ? AppColors.primary : AppColors.white;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        showDialog(
            context: context,
            builder: (context) {
              return Dialog(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0)),
                child: DownloadAppDialog(text: text),
              );
            }); // Call the Dialog.
      },
      child: Container(
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: _color, width: 1)),
        padding: EdgeInsets.symmetric(
          vertical: Sizes(5, 10, 10).responsiveValue(context),
          horizontal: Sizes(10, 10, 20).responsiveValue(context),
        ),
        child: Text(
          text,
          style: AppStyle.p1(context).copyWith(color: _color),
        ),
      ),
    );
  }
}
