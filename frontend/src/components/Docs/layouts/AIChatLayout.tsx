import type { DocTopic } from '../types';

interface AIChatLayoutProps {
  activeTopic: DocTopic;
  resData: any;
}

export default function AIChatLayout({ activeTopic, resData }: AIChatLayoutProps) {
  return (
    <div className="response-layout">
      <div className="response-header">
        <h2 className="response-title">
          {activeTopic.title} Response
        </h2>
      </div>

      <div className="response-list">
        <div className="response-card response-value" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '24px', lineHeight: '1.7' }}>
          {resData.response}
        </div>
      </div>
    </div>
  );
}
