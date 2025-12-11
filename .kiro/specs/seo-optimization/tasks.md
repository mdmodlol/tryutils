# Implementation Plan

## SEO Optimization Feature

- [x] 1. Set up data layer and configuration






  - [x] 1.1 Create tool configuration data file

    - Create `data/toolConfig.ts` with ToolConfig interface and tool definitions
    - Include id, name (i18n), description, icon, path, category, keywords for each tool
    - _Requirements: 4.1, 4.2_

  - [x] 1.2 Create FAQ data file

    - Create `data/faqData.ts` with FAQ items for each tool
    - Include question, answer, and optional category fields
    - _Requirements: 2.4_
  - [x] 1.3 Update blog article frontmatter


    - Add `relatedTools`, `embedTool`, and `keywords` fields to existing blog articles
    - Update at least 3 articles per category (ImageCompression, HeicConverter, FormatConverter)
    - _Requirements: 4.1, 4.2_
  - [x] 1.4 Add i18n translations for SEO components


    - Add SEO-related translations to `i18n/locales/zh.json` and `i18n/locales/en.json`
    - Include keys: tryOnline, clickToLoad, viewFullFeatures, relatedTools, relatedArticles, faq
    - _Requirements: 6.1, 6.2_

- [x] 2. Implement Schema composables







  - [x] 2.1 Create useFAQSchema composable


    - Implement `composables/useFAQSchema.ts` using nuxt-schema-org
    - Generate FAQPage structured data from FAQ items array
    - _Requirements: 2.1, 2.2_
  - [x] 2.2 Write property test for FAQ schema format




    - **Property 3: FAQ structured data format**
    - **Validates: Requirements 2.1, 2.2**
  - [x] 2.3 Create useHowToSchema composable


    - Implement `composables/useHowToSchema.ts` using nuxt-schema-org
    - Generate HowTo structured data from steps array
    - _Requirements: 3.2_

  - [x] 2.4 Write property test for HowTo schema format

    - **Property 5: HowTo structured data format**
    - **Validates: Requirements 3.2**
  - [x] 2.5 Create useBreadcrumbSchema composable


    - Implement `composables/useBreadcrumbSchema.ts` using nuxt-schema-org
    - Generate BreadcrumbList structured data from breadcrumb items
    - _Requirements: 3.2_

  - [x] 2.6 Write property test for BreadcrumbList schema format

    - **Property 16: BreadcrumbList structured data format**
    - **Validates: Requirements 3.2**

- [x] 3. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement SEO meta composables





  - [x] 4.1 Create useToolPageMeta composable


    - Implement meta generation for tool pages with action words (Free, Online, 免费, 在线)
    - Ensure title under 60 chars, description under 160 chars
    - _Requirements: 5.1, 5.2, 5.4_
  - [x] 4.2 Write property test for title length constraint


    - **Property 7: Title length constraint**
    - **Validates: Requirements 5.1**

  - [x] 4.3 Write property test for meta description length constraint

    - **Property 8: Meta description length constraint**
    - **Validates: Requirements 5.2**
  - [x] 4.4 Write property test for tool page action words

    - **Property 10: Tool page action words**
    - **Validates: Requirements 5.4**
  - [x] 4.5 Create useBlogArticleMeta composable


    - Implement meta generation for blog articles including date in description
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 4.6 Write property test for blog article date in description


    - **Property 9: Blog article date in description**
    - **Validates: Requirements 5.3**

- [x] 5. Implement useRelatedContent composable







  - [x] 5.1 Create useRelatedContent composable




    - Implement `composables/useRelatedContent.ts` for querying related articles/tools
    - Use Nuxt Content queryContent with frontmatter-based filtering
    - _Requirements: 4.1, 4.2_
  - [x] 5.2 Write property test for related content anchor text


    - **Property 6: Related content anchor text**
    - **Validates: Requirements 4.3**

- [x] 6. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement BreadcrumbNav component






  - [x] 7.1 Create BreadcrumbNav component

    - Implement `components/BreadcrumbNav.vue` with navigation and schema generation
    - Include proper ARIA attributes for accessibility
    - Support i18n for breadcrumb labels
    - _Requirements: 3.2_

  - [x] 7.2 Write unit test for BreadcrumbNav component

    - Test rendering with various breadcrumb configurations
    - Test schema generation integration
    - _Requirements: 3.2_

- [x] 8. Enhance FAQ component with structured data








  - [x] 8.1 Update FAQ component with schema support



    - Modify existing `components/FAQ.vue` to integrate useFAQSchema
    - Add generateSchema prop (default true)
    - Ensure proper ARIA attributes (aria-expanded, aria-controls)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 8.2 Write property test for FAQ ARIA attributes

    - **Property 4: FAQ ARIA attributes**
    - **Validates: Requirements 2.3**

- [x] 9. Implement BlogToolEmbed component









  - [x] 9.1 Create BlogToolEmbed MDC component


    - Implement `components/content/BlogToolEmbed.vue` with lazy loading
    - Use Intersection Observer for visibility detection
    - Include placeholder/skeleton UI before loading
    - Support compact mode and CTA display
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 9.2 Write property test for lazy loading placeholder


    - **Property 17: Lazy loading placeholder presence**
    - **Validates: Requirements 7.1, 7.2**
  - [x] 9.3 Write property test for embedded tool functionality


    - **Property 2: Embedded tool functionality equivalence**
    - **Validates: Requirements 1.3**

- [x] 10. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement RelatedContent component





  - [x] 11.1 Create RelatedContent component


    - Implement `components/RelatedContent.vue` for displaying related tools/articles
    - Use useRelatedContent composable for data fetching
    - Include descriptive anchor text with keywords
    - _Requirements: 4.1, 4.2, 4.3_


  - [x] 11.2 Write unit test for RelatedContent component





    - Test rendering for both tools and articles modes
    - Test keyword-based anchor text generation
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 12. Implement ToolPageContent component





  - [x] 12.1 Create ToolPageContent component


    - Implement `components/ToolPageContent.vue` with HowTo steps section
    - Include comparison table and usage statistics
    - Integrate useHowToSchema for structured data
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 12.2 Write unit test for ToolPageContent component


    - Test HowTo steps rendering
    - Test comparison table rendering
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 13. Integrate components into tool pages







  - [x] 13.1 Update image-compressor page


    - Add BreadcrumbNav, FAQ section, RelatedContent, and ToolPageContent
    - Apply useToolPageMeta for optimized meta tags
    - _Requirements: 2.4, 3.1, 3.2, 4.2, 5.1, 5.2, 5.4_

  - [x] 13.2 Update heic-converter page

    - Add BreadcrumbNav, FAQ section, RelatedContent, and ToolPageContent
    - Apply useToolPageMeta for optimized meta tags
    - _Requirements: 2.4, 3.1, 3.2, 4.2, 5.1, 5.2, 5.4_

  - [x] 13.3 Update image-format-converter page



    - Add BreadcrumbNav, FAQ section, RelatedContent, and ToolPageContent
    - Apply useToolPageMeta for optimized meta tags
    - _Requirements: 2.4, 3.1, 3.2, 4.2, 5.1, 5.2, 5.4_

- [x] 14. Integrate components into blog pages





  - [x] 14.1 Update blog article template


    - Add BreadcrumbNav to blog article pages
    - Add RelatedContent (tools) section at article end
    - Apply useBlogArticleMeta for optimized meta tags
    - _Requirements: 4.1, 5.1, 5.2, 5.3_


  - [x] 14.2 Add BlogToolEmbed to sample blog articles





    - Update 2-3 blog articles with embedded tool components using MDC syntax
    - Test lazy loading behavior
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 15. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Implement multi-language SEO enhancements






  - [x] 16.1 Verify hreflang tag implementation

    - Ensure all pages include hreflang tags for zh and en locales
    - Verify canonical URL updates on language switch
    - _Requirements: 6.1, 6.4_
  - [x] 16.2 Write property test for hreflang tags completeness


    - **Property 11: Hreflang tags completeness**
    - **Validates: Requirements 6.1**
  - [x] 16.3 Write property test for HTML lang attribute


    - **Property 12: HTML lang attribute correctness**
    - **Validates: Requirements 6.2**

  - [x] 16.4 Write property test for canonical URL language consistency

    - **Property 13: Canonical URL language consistency**
    - **Validates: Requirements 6.4**

- [x] 17. Performance optimizations





  - [x] 17.1 Implement image lazy loading


    - Ensure all below-the-fold images have loading="lazy" attribute
    - _Requirements: 7.2_
  - [x] 17.2 Write property test for image lazy loading


    - **Property 14: Image lazy loading**
    - **Validates: Requirements 7.2**
  - [x] 17.3 Add preload hints for critical resources


    - Add preload link tags for above-the-fold critical resources
    - _Requirements: 7.4_
  - [x] 17.4 Write property test for preload hints


    - **Property 15: Preload hints presence**
    - **Validates: Requirements 7.4**

- [x] 18. Final Checkpoint - Ensure all tests pass














  - Ensure all tests pass, ask the user if questions arise.
