
import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/download_app_btn.dart';
import 'package:promotars_flutter_web_landing_page/screens/web_template.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_style.dart';
import 'package:promotars_flutter_web_landing_page/utils/image_path.dart';

class WhatsInItContentModel {
  final String title;
  final String subtitle;
  final String image;
  WhatsInItContentModel(
      {required this.image, required this.title, required this.subtitle});
}

class Home extends StatelessWidget {
  const Home({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return WebTemplate(child: [
      Container(
        height: 550,
        width: double.infinity,
        padding:
            const EdgeInsets.symmetric(horizontal: AppConfig.contentPadding),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.max,
            children: [
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "One Stop Solution\nFor Business Growth",
                      style: AppStyle.h1.copyWith(fontSize: 50),
                    ),
                    const SizedBox(height: 30),
                    Text(
                      "We help business owners increase their revenue. Our team\nof unique specialist can help you achieve your business goals.",
                      style: AppStyle.p1,
                    ),
                    const SizedBox(height: 30),
                    const DownloadAppButton(
                      text: "Download Now",
                      invertColor: true,
                    ),
                  ],
                ),
              ),
              Image.asset(
                ImagePath.illustration1,
                height: 400,
              ),
            ],
          ),
        ),
      ),
      Container(
        height: 550,
        color: AppColors.primary,
        width: double.infinity,
        padding:
            const EdgeInsets.symmetric(horizontal: AppConfig.contentPadding),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.max,
            children: [
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Promote Your\nBusiness",
                      style: AppStyle.h1
                          .copyWith(fontSize: 50, color: AppColors.white),
                    ),
                    const SizedBox(height: 30),
                    Text(
                      "Our specialized mobile app helps you to promote\nyour business on your desired platforms by enabling\npromoters from various platforms, bring there audience to your business",
                      style: AppStyle.p1.copyWith(color: AppColors.white),
                    ),
                    const SizedBox(height: 30),
                    const DownloadAppButton(text: "Try Now"),
                  ],
                ),
              ),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  ImagePath.socialMedia,
                  height: 400,
                ),
              ),
            ],
          ),
        ),
      ),
      Container(
        height: 550,
        width: double.infinity,
        padding:
            const EdgeInsets.symmetric(horizontal: AppConfig.contentPadding),
        child: const Center(
          child: WhatsInIt(),
        ),
      ),
    ]);
  }
}

class WhatsInIt extends StatefulWidget {
  const WhatsInIt({
    super.key,
  });

  @override
  State<WhatsInIt> createState() => _WhatsInItState();
}

class _WhatsInItState extends State<WhatsInIt>
    with SingleTickerProviderStateMixin {
  late TabController controller = TabController(length: 2, vsync: this);
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 50),
        Text(
          "What's in it for you",
          style: AppStyle.h1,
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 50,
          width: 200,
          child: TabBar(
            controller: controller,
            tabs: const [
              Tab(text: "Business"),
              Tab(text: "Promoters"),
            ],
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: controller,
            children: [
              WhatsInItContent(
                data: [
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Affordable Promotions",
                    subtitle:
                        "No more latent prices and shocked reactions after seeing the final promotion cost. We're here with the most affordable promotions for all",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Targeted Leads",
                    subtitle:
                        "Target your audience based on your business state or city in various platform of your requirement",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Authentic Views",
                    subtitle:
                        "Our robust system keeps bots at bay and make sure all your promotion generate useful leads",
                  ),
                ],
              ),
              WhatsInItContent(
                data: [
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Earn As You Promote",
                    subtitle:
                        "Earn on every unique click you bring from your social network audience to the app",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Redeemable Earnings",
                    subtitle:
                        "What’s the use of getting paid when you can't withdraw money when you want to? Earnings can be transferred from wallet to your bank account at your ease",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Easy Onboarding",
                    subtitle: "Onboard to the app in few clicks",
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class WhatsInItContent extends StatelessWidget {
  const WhatsInItContent({
    super.key,
    required this.data,
  });

  final List<WhatsInItContentModel> data;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        data.length,
        (index) {
          return Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  data[index].image,
                  width: 200,
                ),
                const SizedBox(height: 20),
                Text(
                  data[index].title,
                  style: AppStyle.h4.copyWith(fontWeight: FontWeight.normal),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),
                Text(
                  data[index].subtitle,
                  style: AppStyle.p1.copyWith(fontSize: 15),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}