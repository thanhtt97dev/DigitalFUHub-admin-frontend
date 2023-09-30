import HSBC from '~/assets/images/bank/HSBC.png'
import STB from '~/assets/images/bank/STB.png'
import VBA from '~/assets/images/bank/VBA.png'
import TCB from '~/assets/images/bank/TCB.png'
import VIETINBANK from '~/assets/images/bank/VIETINBANK.png'
import BIDV from '~/assets/images/bank/BIDV.png'
import MB from '~/assets/images/bank/MB.png'
import TPB from '~/assets/images/bank/TPB.png'
import MSB from '~/assets/images/bank/MSB.png'
import VPB from '~/assets/images/bank/VPB.png'
import VCB from '~/assets/images/bank/VCB.png'
import VIB from '~/assets/images/bank/VIB.png'
import SHB from '~/assets/images/bank/SHB.png'
import LPB from '~/assets/images/bank/LPB.png'

export const ADMIN_ROLE = 'Admin';
export const CUSTOMER_ROLE = 'Customer';
export const SELLER_ROLE = 'Seller';
export const NOT_HAVE_MEANING_FOR_TOKEN = 'not have meaning';
export const NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES = 100;
export const TOKEN_EXPIRES_TIME = 10
export const REFRESH_TOKEN_TIME = 9
export const BANK_ACCOUNT_IMAGE_SRC = "https://img.vietqr.io/image/MB-0336687454-compact.png?accountName=LE%20DUC%20HIEU"
export const VIET_QR_SRC = "https://img.vietqr.io/image/"

export const BANKS_INFO = [
    {
        id: "458761",
        name: "TNHH MTV HSBC Việt Nam (HSBC)",
        image: HSBC
    },
    {
        id: "970403",
        name: "Sacombank (STB)",
        image: STB
    },
    {
        id: "970405",
        name: "Nông nghiệp và Phát triển nông thôn (VBA)",
        image: VBA
    },
    {
        id: "970407",
        name: "Kỹ Thương (TCB)",
        image: TCB
    },
    {
        id: "970415",
        name: "Công Thương Việt Nam (VIETINBANK)",
        image: VIETINBANK
    },
    {
        id: "970418",
        name: "Đầu tư và phát triển (BIDV)",
        image: BIDV
    },
    {
        id: "970422",
        name: "Quân đội (MB)",
        image: MB
    },
    {
        id: "970423",
        name: "Tiên Phong (TPB)",
        image: TPB
    },
    {
        id: "970426",
        name: "Hàng hải (MSB)",
        image: MSB
    },
    {
        id: "970432",
        name: "Việt Nam Thinh Vượng (VPB)",
        image: VPB
    },
    {
        id: "970436",
        name: "Ngoại thương Việt Nam (VCB)",
        image: VCB
    },
    {
        id: "970441",
        name: "Quốc tế (VIB)",
        image: VIB
    },
    {
        id: "970443",
        name: "Sài Gòn Hà Nội (SHB)",
        image: SHB
    },
    {
        id: "970449",
        name: "Bưu điện Liên Việt (LPB)",
        image: LPB
    },
]

//request's status
export const RESPONSE_CODE_SUCCESS = "00"
export const RESPONSE_CODE_NOT_ACCEPT = "01"
export const RESPONSE_CODE_DATA_NOT_FOUND = "02"
export const RESPONSE_CODE_FAILD = "03"

export const RESPONSE_CODE_BANK_WITHDRAW_PAID = "BANK_01";
export const RESPONSE_CODE_BANK_WITHDRAW_UNPAY = "BANK_02";
export const RESPONSE_CODE_BANK_WITHDRAW_BILL_NOT_FOUND = "BANK_03";

//signal r

export const SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE = "ReceiveMessage";
export const SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION = "ReceiveNotification";
export const SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION = "ReceiveAllNotification";

export const HEADER_WITHDRAW_BY_LIST_EXCEL_FILE = [
    [
        {
            value: "",
            span: 1,
            align: "center",
            backgroundColor: "#FFFF"
        },
        {
            value: "DANH SÁCH GIAO DỊCH",
            span: 5,
            align: "center",
            backgroundColor: "#FFFF"
        },
    ],
    [
        {
            value: "STT",
            span: 1,
            align: "center",
            backgroundColor: "#D9D9D9",
            height: 44,
            fontWeight: "bold",
        },
        {
            value: "Số tài khoản",
            span: 1,
            align: "center",
            backgroundColor: "#D9D9D9",
            height: 44,
            fontWeight: "bold",
        },
        {
            value: "Tên người thụ hưởng",
            span: 1,
            align: "center",
            backgroundColor: "#D9D9D9",
            height: 44,
            fontWeight: "bold",
        },
        {
            value: "Ngân hàng thụ hưởng/Chi nhánh",
            span: 1,
            align: "center",
            backgroundColor: "#D9D9D9",
            height: 44,
            fontWeight: "bold",
        },
        {
            value: "Số tiền",
            span: 1,
            align: "center",
            backgroundColor: "#D9D9D9",
            height: 44,
            with: 24,
            fontWeight: "bold",
        },
        {
            value: "Nội dung chuyển khoản",
            span: 1,
            align: "center",
            backgroundColor: "#D9D9D9",
            height: 44,
            with: 44,
            fontWeight: "bold",
        },
    ]
]

export const SCHEMA_WITHDRAW_BY_LIST_EXCEL_FILE = [
    {
        column: 'STT',
        type: String,
        value: data => data.key
    },
    {
        column: 'Số tài khoản',
        type: Number,
        value: data => data.creditAccount
    },
    {
        column: 'Tên người thụ hưởng',
        type: String,
        value: data => data.creditAccountName
    },
    {
        column: 'Ngân hàng thụ hưởng/Chi nhánh',
        type: Boolean,
        value: data => data.bankName
    },
    {
        column: 'Số tiền',
        type: Number,
        value: data => data.amount
    },
    {
        column: 'Nội dung chuyển khoản',
        type: String,
        value: data => data.code
    }
]


export const COLUMNS_WITHDRAW_BY_LIST_EXCEL_FILEcolumns = [
    { with: 15 },
    { with: 27 },
    { with: 32 },
    { width: 36 },
    { width: 44 },
    { width: 24 },
    { width: 44 },
]





