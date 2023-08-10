import { InterigationApiResponse } from '@/types/interface';
export interface StateProps {
   user?: InterigationApiResponse | null;
   showSuccessPopUp: boolean;
   selectedTab: string;
}
