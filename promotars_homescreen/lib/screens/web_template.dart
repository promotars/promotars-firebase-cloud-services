import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/web_app_bar.dart';
import 'package:promotars_flutter_web_landing_page/components/web_footer.dart';
import 'package:promotars_flutter_web_landing_page/utils/responsive.dart';

class WebTemplate extends StatelessWidget {
  const WebTemplate({
    super.key,
    required this.child,
  });

  final List<Widget> child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const WebAppBar(),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  ...child,
                  Responsive.isMobile(context)
                      ? const MobileWebFooter()
                      : const WebFooter(),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
