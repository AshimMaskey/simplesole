import {
  getFooterInfo,
  getFooterLinks,
  getFooterSocialLinks,
} from "@/app/actions/footer";

export default async function Footer() {
  const [footerInfo, footerLinks, socialLinks] = await Promise.all([
    getFooterInfo(),
    getFooterLinks(),
    getFooterSocialLinks(),
  ]);

  return (
    <footer>
      <div className="bg-gray-800 py-4 text-gray-400">
        <div className="container px-4 mx-auto">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="px-4 my-4 w-full xl:w-1/5">
              <div className="mb-3">
                <h1 className="text-3xl font-semibold text-white">
                  {footerInfo?.companyName || "SoleMate"}
                </h1>
              </div>
              <p className="text-justify">
                {footerInfo?.description ||
                  "Premium e-commerce platform dedicated to bringing you the latest styles."}
              </p>
            </div>

            {/* Quick Links Section */}
            <div className="px-4 my-4 w-full sm:w-auto">
              <div>
                <h2 className="inline-block text-2xl pb-4 mb-4 border-b-4 border-indigo-600">
                  Company
                </h2>
              </div>
              <ul className="leading-8">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} className="hover:text-indigo-400">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links Section */}
            <div className="px-4 my-4 w-full sm:w-auto xl:w-1/5">
              <div>
                <h2 className="inline-block text-2xl pb-4 mb-4 border-b-4 border-indigo-600">
                  Connect With Us
                </h2>
              </div>
              <div>
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-indigo-400 hover:border-indigo-400"
                  >
                    <div
                      className="w-4 h-4 fill-current"
                      dangerouslySetInnerHTML={{ __html: social.icon }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-center py-4 text-gray-300">
        {footerInfo?.copyrightText || "© 2025 SoleMate. All Rights Reserved."}
      </div>
    </footer>
  );
}
