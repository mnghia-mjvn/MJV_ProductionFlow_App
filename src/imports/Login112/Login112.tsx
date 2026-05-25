import svgPaths from "./svg-x6jtzihnoy";
import imgSliderCalendar1 from "./a8e25246cbd5170e1c08802d1800fdf3d453e317.png";
import imgMiJackProductsLogoFcWeb1 from "./0758065b09caa1922ffaa90cb45af61cd56f3f89.png";
import imgMicrosoftLogo from "./b413fa58018f84bf9393d355080ec7aec0b04a67.png";
import imgGoogleGLogoSvg1 from "./5f9849d48a93a090005402daafc8ef822895df44.png";

function RightSide() {
  return (
    <div className="absolute h-[11.88px] right-[15.38px] top-[18.16px] w-[69.861px]" data-name="Right Side">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69.8611 11.8799">
        <g id="Right Side">
          <g id="Battery">
            <path d={svgPaths.p336ef900} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, black)" strokeWidth="1.048" />
            <path d={svgPaths.p257510dc} fill="var(--fill-0, black)" id="Combined Shape" opacity="0.4" />
            <path d={svgPaths.p2d29700} fill="var(--fill-0, black)" id="Rectangle_2" />
          </g>
          <path d={svgPaths.p29450040} fill="var(--fill-0, black)" id="Wifi" />
          <path d={svgPaths.p8660b00} fill="var(--fill-0, black)" id="Mobile Signal" />
        </g>
      </svg>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="absolute contents left-[22.01px] top-[12.58px]" data-name="Left Side">
      <div className="absolute h-[22.008px] left-[22.01px] rounded-[32px] top-[12.58px] w-[56.592px]" data-name="Time">
        <div className="absolute h-[11.621px] left-[13.05px] top-[5.42px] w-[29.791px]" data-name="9:41">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.7906 11.6211">
            <g id="9:41">
              <path d={svgPaths.p16011200} fill="var(--fill-0, black)" />
              <path d={svgPaths.p120e4680} fill="var(--fill-0, black)" />
              <path d={svgPaths.p40a080} fill="var(--fill-0, black)" />
              <path d={svgPaths.pa786e00} fill="var(--fill-0, black)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function IPhoneXOrNewer() {
  return (
    <div className="absolute h-[48px] left-0 overflow-clip top-0 w-[393px]" data-name="iPhone X (or newer)">
      <RightSide />
      <LeftSide />
    </div>
  );
}

function Title() {
  return (
    <div className="absolute bg-white h-[206px] left-0 overflow-clip top-[96px] w-[393px]" data-name="Title">
      <div className="absolute h-[350px] left-[-38px] top-[-89px] w-[448px]" data-name="slider-calendar 1">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgSliderCalendar1} />
          <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
        </div>
      </div>
      <p className="-translate-x-1/2 [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] absolute font-['Sofia_Sans_Extra_Condensed:Bold',sans-serif] font-bold leading-[normal] left-[196.5px] text-[48px] text-center text-white top-[87px] w-[285px]">PRODUCTION FLOW</p>
    </div>
  );
}

function HeaderContainer() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#f5f5f5] content-stretch flex h-[48px] items-center justify-between left-1/2 px-[20px] top-[48px] w-[393px]" data-name="Header Container">
      <div className="h-[33px] relative shrink-0 w-[143px]" data-name="mi-jack_products_logo_fc-web 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMiJackProductsLogoFcWeb1} />
      </div>
      <div className="content-stretch flex gap-[8px] h-[32px] items-center justify-center pl-[12px] pr-[8px] py-[4px] relative rounded-[12px] shrink-0" style={{ backgroundImage: "linear-gradient(132.523deg, rgba(255, 255, 255, 0.9) 17.374%, rgba(255, 255, 255, 0.5) 49.118%, rgba(255, 255, 255, 0.9) 83.281%)" }} data-name="Button">
        <div className="relative shrink-0 size-[24px]" data-name="outline/global">
          <div className="absolute inset-[5.21%]" data-name="Icon stroke">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
              <g id="Icon stroke">
                <path d={svgPaths.p11b35380} fill="var(--fill-0, #5E6573)" />
                <path d={svgPaths.p1737bf00} fill="var(--fill-0, #5E6573)" />
                <path d={svgPaths.p39a5ee80} fill="var(--fill-0, #5E6573)" />
                <path d={svgPaths.p3cd61980} fill="var(--fill-0, #5E6573)" />
                <path d={svgPaths.p2f35e000} fill="var(--fill-0, #5E6573)" />
              </g>
            </svg>
          </div>
        </div>
        <p className="[word-break:break-word] font-['Noto_Sans:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#5e6573] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          EN
        </p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[100px]">
      <div className="relative shrink-0 size-[18px]" data-name="outline/book">
        <div className="absolute inset-[5.21%_11.46%]" data-name="Icon stroke">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.875 16.125">
            <g id="Icon stroke">
              <path d={svgPaths.p7eb4d80} fill="var(--fill-0, #0E70B8)" />
              <path d={svgPaths.p2f443080} fill="var(--fill-0, #0E70B8)" />
              <path d={svgPaths.p36398480} fill="var(--fill-0, #0E70B8)" />
              <path d={svgPaths.p6e45000} fill="var(--fill-0, #0E70B8)" />
            </g>
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Noto_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0e70b8] text-[14px] whitespace-nowrap">
        <p className="leading-[1.4]">User guide</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center justify-center min-w-px relative">
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="outline/message-chat-square">
        <div className="absolute inset-[5.21%]" data-name="Icon stroke">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.125 16.125">
            <path clipRule="evenodd" d={svgPaths.p26390700} fill="var(--fill-0, #0E70B8)" fillRule="evenodd" id="Icon stroke" />
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Noto_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0e70b8] text-[14px] whitespace-nowrap">
        <p className="leading-[1.4]">FAQs</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center justify-end min-w-px relative">
      <div className="relative shrink-0 size-[18px]" data-name="outline/directbox-notif">
        <div className="absolute inset-[5.21%_9.29%_5.21%_9.38%]" data-name="Icon stroke">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.64 16.125">
            <g id="Icon stroke">
              <path d={svgPaths.p1af05f00} fill="var(--fill-0, #0E70B8)" />
              <path d={svgPaths.p2e7d5c00} fill="var(--fill-0, #0E70B8)" />
              <path d={svgPaths.p39388400} fill="var(--fill-0, #0E70B8)" />
              <path d={svgPaths.p34238800} fill="var(--fill-0, #0E70B8)" />
            </g>
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Noto_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0e70b8] text-[14px] whitespace-nowrap">
        <p className="leading-[1.4]">Contact</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center justify-end min-w-px relative">
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="outline/file-shield-02">
        <div className="absolute inset-[5.21%_9.38%_5.21%_13.54%]" data-name="Icon stroke">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.875 16.125">
            <path clipRule="evenodd" d={svgPaths.p1055a100} fill="var(--fill-0, #0E70B8)" fillRule="evenodd" id="Icon stroke" />
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Noto_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0e70b8] text-[14px] whitespace-nowrap">
        <p className="leading-[1.4]">{`T&C`}</p>
      </div>
    </div>
  );
}

function FooterContainer() {
  return (
    <div className="absolute content-stretch flex h-[44px] items-center left-0 px-[16px] top-[774px] w-[393px]" data-name="Footer Container">
      <Frame />
      <Frame3 />
      <Frame2 />
      <Frame1 />
    </div>
  );
}

function InputTextField() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative rounded-[12px] w-full" data-name="Input text field">
      <div aria-hidden="true" className="absolute border border-[#e1e5ed] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="outline/user-03">
            <div className="absolute inset-[9.38%_9.37%_13.54%_9.37%]" data-name="Icon stroke">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 18.5">
                <path clipRule="evenodd" d={svgPaths.pe061c80} fill="var(--fill-0, #0F0F0F)" fillRule="evenodd" id="Icon stroke" />
              </svg>
            </div>
          </div>
          <p className="[word-break:break-word] flex-[1_0_0] font-['Noto_Sans:Regular',sans-serif] leading-[1.4] min-w-px not-italic overflow-hidden relative text-[#0f0f0f] text-[14px] text-ellipsis whitespace-nowrap">jane.doe@mi-jackvietnam.com</p>
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="XCircle">
            <div className="absolute inset-[9.38%_9.38%_9.37%_9.37%]" data-name="Icon stroke">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 19.5">
                <path d={svgPaths.p3e837270} fill="var(--fill-0, #D9D9DB)" id="Icon stroke" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lable() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center justify-center left-[8px] px-[4px] top-[-10px]" data-name="Lable">
      <div className="absolute bg-white h-[7px] left-[2.5%] right-0 top-[10px]" data-name="Background" />
      <p className="[word-break:break-word] font-['Noto_Sans:Regular',sans-serif] leading-[1.4] not-italic overflow-hidden relative shrink-0 text-[#5e6573] text-[14px] text-ellipsis whitespace-nowrap">Username</p>
    </div>
  );
}

function InputTextField1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative rounded-[12px] w-full" data-name="Input text field">
      <div aria-hidden="true" className="absolute border border-[#e1e5ed] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="outline/lock-02">
            <div className="absolute inset-[9.38%_9.38%_9.38%_9.37%]" data-name="Icon stroke">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 19.5">
                <path clipRule="evenodd" d={svgPaths.p982400} fill="var(--fill-0, #0F0F0F)" fillRule="evenodd" id="Icon stroke" />
              </svg>
            </div>
          </div>
          <p className="[word-break:break-word] flex-[1_0_0] font-['Noto_Sans:Regular',sans-serif] leading-[1.4] min-w-px not-italic overflow-hidden relative text-[#0f0f0f] text-[14px] text-ellipsis whitespace-nowrap">********</p>
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="outline/eye-off">
            <div className="absolute inset-[9.38%_5.86%]" data-name="Icon stroke">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.1883 19.5">
                <path clipRule="evenodd" d={svgPaths.p20297100} fill="var(--fill-0, #0F0F0F)" fillRule="evenodd" id="Icon stroke" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lable1() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center justify-center left-[8px] px-[4px] top-[-10px]" data-name="Lable">
      <div className="absolute bg-white h-[7px] left-[2.5%] right-0 top-[10px]" data-name="Background" />
      <p className="[word-break:break-word] font-['Noto_Sans:Regular',sans-serif] leading-[1.4] not-italic overflow-hidden relative shrink-0 text-[#5e6573] text-[14px] text-ellipsis whitespace-nowrap">Password</p>
    </div>
  );
}

function Fields() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Fields">
      <div className="content-stretch flex flex-col gap-[4px] h-[48px] items-start relative shrink-0 w-full" data-name="Text input/Mobile">
        <InputTextField />
        <Lable />
      </div>
      <div className="content-stretch flex flex-col gap-[4px] h-[48px] items-start relative shrink-0 w-full" data-name="Text input/Mobile">
        <InputTextField1 />
        <Lable1 />
      </div>
    </div>
  );
}

function Checkbox() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[20px] top-1/2" data-name="Checkbox">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Checkbox">
          <path d={svgPaths.p3d570e80} fill="var(--fill-0, #2F6BFF)" />
          <path d={svgPaths.p3d570e80} stroke="var(--stroke-0, #2F6BFF)" strokeWidth="1.5" />
          <path d="M15 7L8.32955 13L5 10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ForgotPasswordContainer() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Forgot Password Container">
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Selection controls-label">
        <button className="block cursor-pointer relative shrink-0 size-[24px]" data-name="Selection controls">
          <Checkbox />
        </button>
        <p className="[word-break:break-word] font-['Noto_Sans:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#535965] text-[14px] whitespace-nowrap">Remember me</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[32px] items-center justify-end min-w-px py-[4px] relative rounded-[12px]" data-name="Button">
        <p className="[word-break:break-word] font-['Noto_Sans:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#0e70b8] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Fields />
      <ForgotPasswordContainer />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative shrink-0" data-name="Button">
      <div className="content-stretch flex gap-[12px] h-[46px] items-start overflow-clip relative rounded-[12px] shrink-0 w-[313px]" data-name="Button group">
        <div className="bg-[#0e70b8] flex-[1_0_0] min-w-px relative rounded-[12px] self-stretch" data-name="Button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[12px] relative size-full">
              <p className="[word-break:break-word] font-['Noto_Sans:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#fcfcfc] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                Login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SsoOptions() {
  return (
    <div className="bg-white h-[21px] relative shrink-0 w-full" data-name="SSO options">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[38px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Noto_Sans:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#535965] text-[14px] whitespace-nowrap">Or continue with</p>
        </div>
      </div>
    </div>
  );
}

function SsoButton() {
  return (
    <div className="bg-white h-[48px] relative rounded-[12px] shrink-0 w-full" data-name="SSO Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[119px] py-[13px] relative size-full">
          <div className="relative shrink-0 size-[32px]" data-name="MicrosoftLogo">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMicrosoftLogo} />
          </div>
          <p className="[word-break:break-word] font-['Noto_Sans:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#535965] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            Microsoft
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#535965] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function SsoButton1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[12px] shrink-0 w-full" data-name="SSO Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[119px] py-[13px] relative size-full">
          <div className="relative shrink-0 size-[32px]" data-name="Google__G__logo.svg 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGoogleGLogoSvg1} />
          </div>
          <p className="[word-break:break-word] font-['Noto_Sans:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#535965] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            Google
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#535965] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Form() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[20px] pb-[20px] pt-[24px] px-[20px] rounded-[20px] shadow-[0px_4px_32px_0px_rgba(89,93,176,0.08)] top-[325px] w-[353px]" style={{ backgroundImage: "linear-gradient(108.384deg, rgba(255, 255, 255, 0.9) 17.374%, rgba(255, 255, 255, 0.5) 49.118%, rgba(255, 255, 255, 0.9) 83.281%)" }} data-name="Form">
      <Frame4 />
      <Button />
      <SsoOptions />
      <SsoButton />
      <SsoButton1 />
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-[#f5f5f5] relative size-full" data-name="Login 1.1.2">
      <IPhoneXOrNewer />
      <div className="absolute h-[34px] left-0 top-[818px] w-[393px]" data-name="HomeIndicator">
        <div className="-translate-x-1/2 absolute bg-black bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] w-[134px]" data-name="Home Indicator" />
      </div>
      <Title />
      <HeaderContainer />
      <FooterContainer />
      <Form />
    </div>
  );
}