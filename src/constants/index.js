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

export const ADMIN_USER_ID = 1;

export const ADMIN_ROLE = 'Admin';
export const CUSTOMER_ROLE = 'Customer';
export const SELLER_ROLE = 'Seller';

export const ADMIN_ROLE_ID = 1;
export const CUSTOMER_ROLE_ID = 2;
export const SELLER_ROLE_ID = 3;
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

export const MB_BANK_TRANFER_BY_LIST_EXCEL_FILE_NAME = 'Chuyenkhoantheobangke.xlsx'
export const ORDER_REPORT_EXCEL_FILE_NAME = 'OrdersReport.xlsx'

//request's status
export const RESPONSE_CODE_SUCCESS = "00"
export const RESPONSE_CODE_NOT_ACCEPT = "01"
export const RESPONSE_CODE_DATA_NOT_FOUND = "02"
export const RESPONSE_CODE_FAILD = "03"

export const RESPONSE_CODE_BANK_WITHDRAW_PAID = "BANK_01";
export const RESPONSE_CODE_BANK_WITHDRAW_UNPAY = "BANK_02";
export const RESPONSE_CODE_BANK_WITHDRAW_REJECT = "BANK_03";
export const RESPONSE_CODE_BANK_WITHDRAW_BILL_NOT_FOUND = "BANK_04";

//signal r

export const SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE = "ReceiveMessage";
export const SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION = "ReceiveNotification";
export const SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION = "ReceiveAllNotification";
export const SIGNAL_R_USER_ONLINE_STATUS_HUB_RECEIVE_ONLINE_STATUS = "ReceiveUserOnlineStatus";

//withdraw transaction status
export const WITHDRAW_TRANSACTION_IN_PROCESSING = 1;
export const WITHDRAW_TRANSACTION_PAID = 2;
export const WITHDRAW_TRANSACTION_REJECT = 3;
export const WITHDRAW_TRANSACTION_CANCEL = 4;

//transaction status
export const TRANSACTION_TYPE_INTERNAL_PAYMENT = 1
export const TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT = 2
export const TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND = 3
export const TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT = 4
export const TRANSACTION_INTERNAL_TYPE_SELLER_REGISTRATION_FEE = 5

//transaction status
export const TRANSACTION_COIN_TYPE_RECEIVE = 1;
export const TRANSACTION_COIN_TYPE_USE = 2;
export const TRANSACTION_COIN_TYPE_REFUND = 3;

export const ORDER_ALL = 0;
export const ORDER_WAIT_CONFIRMATION = 1;
export const ORDER_CONFIRMED = 2;
export const ORDER_COMPLAINT = 3;
export const ORDER_SELLER_REFUNDED = 4;
export const ORDER_DISPUTE = 5;
export const ORDER_REJECT_COMPLAINT = 6;
export const ORDER_SELLER_VIOLATES = 7;

//order status
export const RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE = "ORDER_STATUS_01";

//feedback
export const RESPONSE_CODE_FEEDBACK_ORDER_UN_COMFIRM = "FEEDBACK_01";

//Message Type
export const MESSAGE_TYPE_CONVERSATION_TEXT = "0";
export const MESSAGE_TYPE_CONVERSATION_IMAGE = "1";

export const USER_CONVERSATION_TYPE_UN_READ = false;
export const USER_CONVERSATION_TYPE_IS_READ = true;

//product status
export const PRODUCT_STATUS_ACTIVE = 1;
export const PRODUCT_STATUS_BAN = 2;
export const PRODUCT_STATUS_REMOVE = 3;
export const PRODUCT_STATUS_HIDE = 4;

// report product status
export const REPORT_PRODUCT_STATUS_ALL = 0;
export const REPORT_PRODUCT_STATUS_VERIFYING = 1;
export const REPORT_PRODUCT_STATUS_REJECT = 2;
export const REPORT_PRODUCT_STATUS_ACCEPT = 3;


// reason report product status
export const REASON_REPORT_PRODUCT_STATUS_OTHER = 7;

// shop status
export const SHOP_STATUS_ALL = 0;
export const SHOP_STATUS_ACTIVATE = 1;
export const SHOP_STATUS_DEACTIVATE = 2;

// status slider filter
export const STATUS_ALL_SLIDER_FOR_FILTER = 0;
export const STATUS_ACTIVE_SLIDER_FOR_FILTER = 1;
export const STATUS_UN_ACTIVE_SLIDER_FOR_FILTER = 2;

// Paginations
export const PAGE_SIZE = 10;
export const PAGE_SIZE_FEEDBACK = 5;
export const PAGE_SIZE_PRODUCT = 30;
export const PAGE_SIZE_NOTIFICATION = 5;
export const PAGE_SIZE_PRODUCT_WISH_LIST = 30;
export const PAGE_SIZE_PRODUCT_HOME_PAGE = 48;
export const PAGE_SIZE_SEARCH_PRODUCT = 20;
export const PAGE_SIZE_SLIDER = 20;

export const STATISTIC_BY_MONTH = 0;
export const STATISTIC_BY_YEAR = 1;

export const UPLOAD_FILE_SIZE_LIMIT = 2 * 1024 * 1024;

// status user
export const STATUS_USER_ACTIVE = true;
export const STATUS_USER_BAN = false;

export const URL_LOGIN_PAGE = "/login";


export const DEPOSIT_TRANSACTION_STATUS_UNPAY = 1;
export const DEPOSIT_TRANSACTION_STATUS_PAIDED = 2;
export const DEPOSIT_TRANSACTION_STATUS_EXPIRED = 3;
