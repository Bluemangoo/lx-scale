import { decompressFromEncodedURIComponent as decompress } from 'lz-string';
import { calculateYBOCSResults } from '@/components/questionnaire/test/private/YBOCSCalculator';
import { calculateSCL90Results } from '@/components/questionnaire/test/private/SCL90Calculator';
import { calculateSDSResults } from '@/components/questionnaire/test/private/SDSCalculator';
import { calculateGAD7Results } from '@/components/questionnaire/test/private/GAD7Calculator';
import { calculatePHQ9Results } from '@/components/questionnaire/test/private/PHQ9Calculator';
import { calculatePSS10Results } from '@/components/questionnaire/test/private/PSS10Calculator';
import { calculateDASS21Results } from '@/components/questionnaire/test/private/DASS21Calculator';
import { calculateBDI2Results } from '@/components/questionnaire/test/private/BDI2Calculator';
import { calculateISIResults } from '@/components/questionnaire/test/private/ISICalculator';
import { calculateADHDResults } from '@/components/questionnaire/test/private/ADHDCalculator';
import { calculateGDResults } from '@/components/questionnaire/test/private/GDCalculator';
import { calculateNPDResults } from '@/components/questionnaire/test/private/NPDCalculator';
import { calculateSASResults } from '@/components/questionnaire/test/private/SASCalculator';
import { calculateHCL32Results } from '@/components/questionnaire/test/private/HCL32Calculator';

export interface HistorySummary {
  totalScore: number | string;
  level: string;
}

function decodeAnswers(encodedAnswers: string): Record<number, string> {
  const raw = decompress(encodedAnswers) || '';
  const map: Record<number, string> = {};
  raw.split('').forEach((ch, index) => {
    map[index + 1] = ch;
  });
  return map;
}

function pickLevel(result: any): string {
  if (result?.severity) return String(result.severity);
  if (result?.interpretation) return String(result.interpretation);

  const candidates = [
    result?.depressionSeverity,
    result?.anxietySeverity,
    result?.stressSeverity,
  ].filter(Boolean) as string[];

  if (candidates.length > 0) {
    const rank: Record<string, number> = {
      normal: 0,
      no_insomnia: 0,
      low: 1,
      minimal: 1,
      mild: 2,
      subthreshold: 2,
      moderate: 3,
      moderately_severe: 4,
      severe: 5,
      high: 5,
      extreme: 6,
      extremely_severe: 6,
    };

    return [...candidates].sort((a, b) => (rank[b] ?? 0) - (rank[a] ?? 0))[0];
  }

  return '';
}

export function getHistorySummary(questionnaireId: string, encodedAnswers: string): HistorySummary | null {
  if (!encodedAnswers) return null;
  const answers = decodeAnswers(encodedAnswers);
  const args = { answers, questions: [] as any[] };

  let result: any;
  switch (questionnaireId) {
    case 'ocd':
      result = calculateYBOCSResults(args);
      break;
    case 'scl90':
      result = calculateSCL90Results(args);
      break;
    case 'sds':
      result = calculateSDSResults(args);
      break;
    case 'gad7':
      result = calculateGAD7Results(args);
      break;
    case 'phq9':
      result = calculatePHQ9Results(args);
      break;
    case 'pss10':
      result = calculatePSS10Results(args);
      break;
    case 'dass21':
      result = calculateDASS21Results(args);
      break;
    case 'bdi2':
      result = calculateBDI2Results(args);
      break;
    case 'isi':
      result = calculateISIResults(args);
      break;
    case 'adhd':
    case 'asrs':
      result = calculateADHDResults(args);
      break;
    case 'gd':
      result = calculateGDResults(args);
      break;
    case 'npd':
      result = calculateNPDResults(args);
      break;
    case 'sas':
      result = calculateSASResults(args);
      break;
    case 'hcl32':
      result = calculateHCL32Results(args);
      break;
    default:
      return null;
  }

  return {
    totalScore: result?.totalScore ?? '-',
    level: pickLevel(result),
  };
}
