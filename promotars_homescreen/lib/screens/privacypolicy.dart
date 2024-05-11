import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/screens/web_template.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return WebTemplate(
      child: [
        Padding(
          padding: EdgeInsets.symmetric(
                  horizontal: AppConfig.contentPadding(context))
              .copyWith(top: 20),
          child: const Text(
            '''
        Welcome to ${AppConfig.appName}!
          
          This Privacy Policy describes how we collect, use, and disclose your information when you use our mobile application and related services.
          
          1. Information We Collect
          
          We collect information to provide and improve our services:
          
          * User information (name, email, social media profile)
          * Campaign information (target audience, platforms, clicks)
          * Usage information (campaigns viewed, content created)
          * Device information (device type, OS, IP address)
          
          2. How We Use Your Information
          
          We use your information to:
          
          * Provide and improve services (matching Businesses with Influencers)
          * Send promotional communications (with your consent)
          * Analyze trends and usage patterns
          * Personalize your experience
          * Comply with legal obligations
          
          3. Information Sharing
          
          We may share your information with:
          
          * Businesses you work with on campaigns
          * Service providers who help us operate the App
          * Law enforcement or other government agencies (if required by law)
          
          We will never share your information with third-party advertisers without your consent.
          
          4. Data Security
          
          We take steps to protect your information. However, no internet transmission is completely secure.
          
          5. Your Choices
          
          You can control your privacy settings within the App and:
          
          * Access and update your information
          * Opt out of receiving promotional communications
          * Delete your account
          
          6. Children's Privacy
          
          Our services are not directed to children under ${AppConfig.minAge}. We do not knowingly collect personal information from children under 16.
          
          7. Changes to this Policy
          
          We may update this Privacy Policy. We will notify you of any changes.
          
          8. Contact Us
          
          If you have questions, please contact us at ${AppConfig.contactEmail}.
          ''',
            textAlign: TextAlign.left,
          ),
        ),
      ],
    );
  }
}
