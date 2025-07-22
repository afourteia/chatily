import { Card } from '@/components/ui/card';
import Decimal from 'decimal.js';
export function PayAmountDetails({
  baseAmount,
  bonus,
  reduction,
}: {
  baseAmount: Decimal;
  bonus: Decimal;
  reduction: Decimal;
}) {
  return (
    <Card className="p-2">
      <table className="w-full">
        <tbody>
          <tr>
            <td className="pe-1">القيمة الأساسية:</td>
            <td className="text-right">{baseAmount.toFixed(2)}</td>
          </tr>
          <tr className="text-success">
            <td className="pe-1">المكافئات:</td>
            <td className="text-right">{bonus.toFixed(2)}</td>
          </tr>
          <tr className="text-destructive">
            <td className="pe-1">الخصومات:</td>
            <td className="text-right">{reduction.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
