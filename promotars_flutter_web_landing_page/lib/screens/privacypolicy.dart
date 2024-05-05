import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/screens/web_template.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return WebTemplate(
      child: [
        Text("Privacy Policy"),
      ],
    );
  }
}
