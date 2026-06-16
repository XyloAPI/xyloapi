import { useState } from 'react';

interface EndpointModule {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  status: 'active' | 'maintenance';
  payloadSchema: string;
  responsePreview: string;
}

const ENDPOINTS: EndpointModule[] = [
  {
    id: "scrapers-social",
    name: "Social Media Profiles",
    method: "POST",
    path: "/api/v1/social/profile",
    description: "Extract target profiles, bios, timelines, and engagement metrics from Twitter, Instagram, or TikTok.",
    status: "active",
    payloadSchema: `{
  "url": "https://twitter.com/lamborghini",
  "limit": 10
}`,
    responsePreview: `{
  "success": true,
  "data": {
    "profile": {
      "username": "lamborghini",
      "followers": "28.4M",
      "bio": "Official account of Automobili Lamborghini. Shaping the future."
    }
  }
}`
  },
  {
    id: "scrapers-ecommerce",
    name: "E-Commerce Products",
    method: "POST",
    path: "/api/v1/ecommerce/product",
    description: "Extract pricing details, stock status, ratings, and reviews from Amazon, Tokopedia, or Shopee.",
    status: "active",
    payloadSchema: `{
  "url": "https://amazon.com/dp/B08N5WRWNW"
}`,
    responsePreview: `{
  "success": true,
  "data": {
    "product_name": "Carbon Hex Design Air Filter",
    "price": "$129.99",
    "availability": "In Stock"
  }
}`
  },
  {
    id: "scrapers-se",
    name: "Search Engine Results",
    method: "POST",
    path: "/api/v1/search/google",
    description: "Retrieve organic search results, snippets, and page index lists directly from Google or Bing.",
    status: "active",
    payloadSchema: `{
  "query": "Lamborghini Temerario specs"
}`,
    responsePreview: `{
  "success": true,
  "query": "Lamborghini Temerario specs",
  "results": [
    {
      "title": "Lamborghini Temerario Specs",
      "link": "https://www.lamborghini.com/en-en/models/temerario"
    }
  ]
}`
  },
  {
    id: "enrichment-ai",
    name: "AI Schema Extractor",
    method: "POST",
    path: "/api/v1/enrichment/schema",
    description: "Use LLMs to automatically extract structured entities and details from unformatted raw scraping outputs.",
    status: "active",
    payloadSchema: `{
  "raw_text": "Product is a car model Temerario priced around 300k",
  "schema": {
    "price": "string",
    "model": "string"
  }
}`,
    responsePreview: `{
  "success": true,
  "extracted": {
    "price": "300k",
    "model": "Temerario"
  }
}`
  },
  {
    id: "utilities",
    name: "Proxy Pool Status",
    method: "GET",
    path: "/api/v1/utilities/proxy-status",
    description: "Get active residential proxy latency status, check IP blacklists, and rotate routing pools.",
    status: "active",
    payloadSchema: `None (Query Parameters optional: ?pool=default)`,
    responsePreview: `{
  "status": "healthy",
  "active_ip": "185.190.140.22",
  "average_latency": "142ms",
  "pool": "residential_us"
}`
  }
];

export default function EndpointsPreview() {
  const [expandedId, setExpandedId] = useState<string | null>('scrapers-social');

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <section id="endpoints" className="endpoints-section">
      <div className="container">
        


        {/* Directory List Table */}
        <div className="directory-table">
          {/* Header row */}
          <div className="directory-header-row">
            <span>Method</span>
            <span>Route Path</span>
            <span>Description</span>
            <span style={{ textAlign: 'right' }}>Status</span>
          </div>

          {/* Table Items */}
          {ENDPOINTS.map((ep) => {
            const isExpanded = expandedId === ep.id;
            return (
              <div key={ep.id} className="directory-item-row">
                
                {/* Visible Info */}
                <div className="directory-item-visible" onClick={() => toggleExpand(ep.id)}>
                  <div>
                    <span className={`method-badge ${ep.method === 'GET' ? 'get' : ''}`}>
                      {ep.method}
                    </span>
                  </div>
                  <div>
                    <span className="route-path">{ep.path}</span>
                  </div>
                  <div>
                    <span className="route-description">{ep.description}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="terminal-status-light">
                      <span className="terminal-status-dot" />
                      <span>{ep.status}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="directory-item-detail">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-2-col">
                      <div>
                        <span className="detail-section-title">Request Payload Schema</span>
                        <pre className="payload-preview">
                          <code>{ep.payloadSchema}</code>
                        </pre>
                      </div>
                      <div>
                        <span className="detail-section-title">Response JSON Preview</span>
                        <pre className="payload-preview">
                          <code>{ep.responsePreview}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
