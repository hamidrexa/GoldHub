import { Icons } from "@/components/ui/icons"
import { Locale } from "@/i18n-config";
import { currency } from "@/libs/utils";
import dayjs from "dayjs"

type Props = {
    item: any;
    lang: Locale;
};

export default function HistoryItem({ item, lang }: Props) {
    const dateItem = item?.created_at?.replace(/\.\d+/g, '')
    const date = dateItem && dayjs
        (dateItem)
        .calendar(
            lang === 'fa' ? 'jalali' : 'gregory'
        )
        .locale(lang)
        .format(
            'HH:mm - YYYY/MM/DD'
        )

    const items = {
        sell: {
            title: 'فروش طلا',
            icon: <Icons.sellGold />,
            measure: 'geram',
            measureTitle: 'گرم'
        },
        buy: {
            title: 'خرید طلا',
            icon: <Icons.buyGold />,
            measure: 'geram',
            measureTitle: 'گرم'
        },
        deposit: {
            title: 'واریز تومان',
            icon: <Icons.money />,
            measure: 'toman',
            measureTitle: 'تومان'
        },
        withdraw: {
            title: 'برداشت تومان',
            icon: <Icons.money />,
            measure: 'toman',
            measureTitle: 'تومان'
        },
    }

    return <div className='flex w-full justify-between items-center'>
        <div className='flex flex-row gap-4 items-center'>
            {items[item?.type_choice]?.icon}
            <div className='text-[14px] font-bold mt-2'>
                {
                    items[item?.type_choice]?.title
                }
            </div>
        </div>
        <div className='flex justify-start gap-2 flex-col items-end'>
            <div className='flex gap-[4px] '>
                <span className='text-[28px] font-bold'
                    style={{
                        color: item.type_choice === 'buy' ? '#07BB61' : '#DB2777CC'
                    }}
                >
                    {
                        items[item?.type_choice]?.measureTitle === 'geram' ? Number(item?.amount)?.toFixed(4) : currency(Number(item.amount), 'tse', lang)
                    }
                </span>
                <span className='text-[14px] text-[#74759A]'>
                    {items[item?.type_choice]?.measureTitle}
                </span>
            </div>
            <div className='text-[14px] text-[#74759A]'>
                {item?.created_at && date}
            </div>
        </div>
    </div>
}