i need net core solution with 2 microservices using 

1. identity server duende and user management. There should be 4 different roles: admin, distributor, influencer, user 
2. solution for API to manage API where 
- distributor can search influencers and via verse, create products on platform and link them with their own shop item. Service should be able to create unique links for products for each influencer in the web for commision
- distributor can send request to apply contract with influencers, and  influencers should be able to accept or reject it
- influencer can search for distributors or products, and send a request that they want to advertise them
- User can follow influencer and to be able to view his posts where on each post the influencer could have links to products which he advertises 


Generate image about a new awesome affiliative platform with name Clicksi

Interlocalization
Dark mode

Confirmed email with dedicated page for confirmations
https://claude.ai/share/f38f3d95-bcfe-4bd3-8e61-e51fe36cdfac

MFA using  generated otp: email, phone or authentificator using qr code?
https://claude.ai/share/8ff5cfb6-81b9-417d-9279-2cea82f8c030

Identity server with sso providers + next.js: 
- https://claude.ai/chat/1d04a2e5-cc42-4855-b22e-3ff538fc0d38
- (+) good example of OIDC with refresh token on Next,js side with NextAuth
  - https://claude.ai/chat/e389dfc7-d677-4eed-a6a8-293e47684f9a 


LTK grooming + AUTH service implementations
https://claude.ai/chat/67ba91ca-5bd4-4f49-9e99-9f25c9f4b5e1

```
const component = () => <> 

</>;

export default component;
```

Domains + Email = 1$ first year
https://www.namecheap.com/domains/registration/results/?domain=click.sy
https://chatgpt.com/c/67d89a08-9f14-800d-b9e7-6961f36568f6

Disable turbopack for vscode debugging
https://youtrack.jetbrains.com/issue/WEB-70462/Cant-debug-nextjs-app-next-dev-turbopack-turbo-breaks-debugging.



## Pages

# sign-in
# sign-up

- Options
  - Distributor/Brand
  - influencers

# products

- Filters
  - best in
- order by
- 

# products/[slug]


# influencers
# influencers/[slug] - nickname

# brands
# brands/[slug] - id

# distributors
# distributors/[slug] - id


## database

### Materialized tables
https://chatgpt.com/share/67cf407e-0f1c-800d-84ba-63bffd2df545




## register forms

Different forms
https://ui.shadcn.com/docs/components/tabs

https://chatgpt.com/share/67d53903-c5b8-800d-b18c-44687645520a


## info how to connect social media, access and refresh tokens for them
https://chatgpt.com/share/67d478ea-b654-800d-a2c7-ffdec9642198

# Registration Fields for Influencers & Brands/Distributors

## Common Fields (For Both Influencers & Brands/Distributors)
- **Full Name / Company Name**
- **Email Address**
- **Phone Number**
- **Password**
- **Country & City**
- **Profile Picture / Logo**
- **Website / Social Media Links**

---

## For Influencers
- **Username / Display Name**
- **Social Media Platforms** (Check options: Instagram, TikTok, YouTube, etc.)
- **Follower Count** (per platform)
- **Engagement Rate** (if available)
- **Primary Content Category** (e.g., Fashion, Tech, Fitness, Gaming, etc.)
- **Languages Spoken**
- **Collaboration Preferences** (Paid, Barter, Affiliate, etc.)
- **Brands Worked With** (Optional)
- **Pricing** (Optional - per post, per campaign, etc.)
- **Media Kit Upload** (Optional)

---

## For Brands / Distributors
- **Brand / Business Name**
- **Industry / Niche**
- **Company Size** (Small, Medium, Large)
- **Target Audience** (Age, Gender, Region, Interests, etc.)
- **Budget Range for Collaborations**
- **Collaboration Type** (Sponsorship, Affiliate, Product Gifting, etc.)
- **Products / Services Offered**
- **Company Description / About Us**