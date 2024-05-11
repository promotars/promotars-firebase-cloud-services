import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/screens/web_template.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';

class TermsAndConditionScreen extends StatelessWidget {
  const TermsAndConditionScreen({
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
Welcome to ${AppConfig.appName}! These Terms and Conditions ("Terms") govern your access and use of the ${AppConfig.appName} mobile application (the "App") and related services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms.

1. Eligibility

You must be at least ${AppConfig.minAge} years old and have the legal capacity to enter into a binding contract to use the Services.

2. User Accounts

    2.1 Businesses

    Businesses can create accounts to post campaigns and connect with Influencers. Businesses are responsible for:

    * Providing accurate and complete information about themselves and their campaigns.
    * Complying with all applicable laws and regulations in connection with their use of the Services.
    * Paying ${AppConfig.companyName} for campaign fees in accordance with these Terms.

    2.2 Influencers

    Influencers can create accounts to discover and participate in campaigns. Influencers are responsible for:

    * Creating high-quality content that promotes campaigns in an authentic and engaging manner.
    * Complying with all applicable laws and regulations, including disclosure requirements for sponsored content.
    * Complying with the specific guidelines and requirements of each campaign they participate in.

3. Campaigns

Businesses can create campaigns on the App. Campaigns will specify:

* Target audience
* Social media platforms for promotion
* Desired number of unique clicks
* Compensation for Influencers

4. Influencer Selection

${AppConfig.companyName} uses an algorithm to match Influencers with campaigns based on factors such as audience demographics, engagement rates, and content style. However, ${AppConfig.companyName} reserves the right to select Influencers for campaigns at its sole discretion.

5. Influencer Compensation

Influencers will be paid for each unique click generated through their promotion of a campaign. The specific amount of compensation will be determined by the Business that created the campaign. Payments will be deposited into Influencers' wallets within the App and can be withdrawn using available options.

6. Content Ownership

Influencers retain ownership of the content they create. However, by participating in a campaign, Influencers grant ${AppConfig.companyName} and the Business a non-exclusive, royalty-free license to use their content in connection with the campaign.

7. Disclaimers

${AppConfig.companyName} disclaims any warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. ${AppConfig.companyName} does not guarantee the success of any campaign or the earnings of any Influencer.

8. Limitation of Liability

${AppConfig.companyName} shall not be liable for any damages arising out of or related to your use of the Services, including but not limited to, direct, indirect, incidental, consequential, or punitive damages.

9. Termination

${AppConfig.companyName} may terminate your account at any time for any reason, with or without notice. You may terminate your account at any time by discontinuing your use of the Services.

10. Governing Law

These Terms shall be governed by and construed in accordance with the laws of India.

11. Dispute Resolution

Any dispute arising out of or relating to these Terms shall be resolved by [insert preferred method of dispute resolution, e.g., binding arbitration in accordance with Indian law].

12. Entire Agreement

These Terms constitute the entire agreement between you and ${AppConfig.companyName} regarding your use of the Services.

13. Updates to Terms

${AppConfig.companyName} may update these Terms at any time by posting the revised terms on the App. You are responsible for checking the Terms periodically for updates. Your continued use of the Services following the posting of revised Terms means that you accept and agree to the changes.

14. Contact Us

If you have any questions about these Terms, please contact us at ${AppConfig.contactEmail}.
''',
            textAlign: TextAlign.left,
          ),
        ),
      ],
    );
  }
}
