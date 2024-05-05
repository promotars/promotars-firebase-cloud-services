import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/screens/web_template.dart';

class TermsAndConditionScreen extends StatelessWidget {
  const TermsAndConditionScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return WebTemplate(
      child: [
        Text("Terms And Condition"),
      ],
    );
  }
}
