// Types for the quiz data
export interface QuizOption {
  label: string;
  score: number;
}

export interface GateOption {
  label: string;
  value: string;
}

export interface TriggerOption {
  label: string;
  value: string;
  trigger?: string;
}

export interface Question {
  dim: string;
  text: string;
  options: QuizOption[];
}

export interface GateQuestion {
  text: string;
  options: GateOption[];
}

export interface TriggerQuestion {
  text: string;
  options: TriggerOption[];
}

export interface PersonalityType {
  code: string;
  name: string;
  group: string;
  emoji: string;
  color: string;
  img: string;
  vector: string;
  desc: string;
  slogan: string;
}

export interface SpecialType {
  code: string;
  name: string;
  emoji: string;
  color: string;
  img: string;
  trigger: string;
  desc: string;
  slogan: string;
}

export interface Model {
  id: string;
  name: string;
  dimensions: string[];
}

export interface Group {
  id: string;
  name: string;
}

export interface QuizData {
  meta: {
    title: string;
    subtitle: string;
    description: string;
    version: string;
  };
  models: Model[];
  groups: Group[];
  types: PersonalityType[];
  specialTypes: SpecialType[];
  questions: Question[];
  gateQuestion: GateQuestion;
  triggerQuestion: TriggerQuestion;
}

// Constants
export const DIM_ORDER = [
  "A1",
  "A2",
  "A3",
  "S1",
  "S2",
  "S3",
  "T1",
  "T2",
  "T3",
  "E1",
  "E2",
  "E3",
  "G1",
  "G2",
  "G3",
];

export const VECTOR_VALUE: Record<string, number> = { H: 2, M: 1, L: 0 };

export const QUIZ_DATA: QuizData = {
  meta: {
    title: "WBTI 卫戍人格测试",
    subtitle: "你是什么类型的卫戍玩家？",
    description: "基于5大模型15个维度，测出你的卫戍协议玩家人格",
    version: "1.0.0",
  },

  models: [
    {
      id: "A",
      name: "沉迷模型",
      dimensions: ["A1 游戏依赖度", "A2 投入认真度", "A3 探索热情"],
    },
    {
      id: "S",
      name: "社交模型",
      dimensions: ["S1 联机偏好", "S2 团队定位", "S3 对抗性"],
    },
    {
      id: "T",
      name: "策略模型",
      dimensions: ["T1 规划度", "T2 风险偏好", "T3 灵活度"],
    },
    {
      id: "E",
      name: "情感模型",
      dimensions: ["E1 本命执着", "E2 消费冲动", "E3 完美收集"],
    },
    {
      id: "G",
      name: "风格模型",
      dimensions: ["G1 创新度", "G2 效率导向", "G3 逆反程度"],
    },
  ],

  groups: [
    { id: "gan", name: "【肝帝探索组】" },
    { id: "yun", name: "【上分运营组】" },
    { id: "gao", name: "【搞事社交组】" },
    { id: "chu", name: "【厨力氪金组】" },
    { id: "fan", name: "【叛逆整活组】" },
    { id: "bai", name: "【摆烂摸鱼组】" },
  ],

  types: [
    {
      code: "WXUY",
      name: "卫瘾患者",
      group: "gan",
      emoji: "🎮",
      color: "#8B5CF6",
      img: "img/博士疲惫睡着.png",
      vector: "HHH-MMM-MMM-MMM-MMM",
      desc: "朋友，你不是一个普通的卫戍玩家，你是卫戍的活体广告牌。当别人还在纠结今天中午吃什么的时候，你的手指已经肌肉记忆般地点开了卫戍的图标。你以为你在享受游戏，其实你只是卫戍协议这台巨大机器里的一个齿轮，而且你转得很开心。朋友叫你出去？等一下，我在打关键局。家人叫你吃饭？等一下，我在打关键局。你在洗澡的时候脑子里都在算升本回合数，做梦都在刷核心卡。你不是沉迷，你只是把人生的进度条和卫戍的进度条焊在了一起。",
      slogan: "一天不卫，浑身发痒",
    },
    {
      code: "LJKM",
      name: "联机区",
      group: "gao",
      emoji: "👥",
      color: "#3B82F6",
      img: "img/合作愉快.png",
      vector: "MMM-HHH-MMM-MMM-MML",
      desc: "说白了，你一个人连游戏都不会打开。对你来说游戏不是游戏，社交才是游戏，卫戍只是你们聚在一起的理由。你可以一个人看完一整部电影，但你没办法一个人打完一局卫戍——因为赢了没人分享约等于没赢，翻车了没人吐槽约等于白翻。你是那种语音频道关了都还在群里聊到凌晨三点的人，你的好友列表比通讯录还长。你不是在联机，你是在经营一个以卫戍为核心的社交帝国。",
      slogan: "没人陪，玩不了一点",
    },
    {
      code: "YLJS",
      name: "公式卫",
      group: "yun",
      emoji: "🦽",
      color: "#64748B",
      img: "img/遵命.png",
      vector: "MMM-MML-HLL-MML-LHL",
      desc: "朋友，你活得像个精密的瑞士钟表。别人在享受卫戍的随机性和不确定性，你在一旁冷笑——随机？不确定？那是因为你们没有背公式。你的大脑里有一张完美的流程图，每一步都标注了最优解，每一个决策都有数据支撑。你打卫戍的方式像是在执行一道已知答案的数学题，你只是在填空。有人说你这样玩没意思，你不懂——不犯错的爽感，你们这些凭感觉打牌的人永远不会理解。你不是在玩游戏，你是在执行计划，而且你很享受这种打工的感觉。",
      slogan: "公式刻进DNA，闭眼都能通",
    },
    {
      code: "DGSH",
      name: "赌狗流",
      group: "yun",
      emoji: "🎰",
      color: "#F43F5E",
      img: "img/流汗了.png",
      vector: "MHM-MML-LHH-MHM-MML",
      desc: "你的多巴胺系统是被赌场设计过的吗？正常人面对风险会犹豫，你面对风险会兴奋。梭哈这两个字对你来说不是冒险，是信仰。你的卫戍生涯就是一部赌徒忏悔录——只不过你从来不忏悔。输了？再来一把，手感来了。又输了？正常波动，下把一定出。你的人生信条就是「万一呢」，这三个字支撑着你度过无数个血崩的夜晚。你不是赌狗，你只是比常人多了一点点对奇迹的执着，和少了一点点对风险的恐惧。",
      slogan: "赌狗永不为奴，梭哈就完了",
    },
    {
      code: "BMTS",
      name: "本命厨",
      group: "chu",
      emoji: "💪",
      color: "#EF4444",
      img: "img/彻底心动.png",
      vector: "MMM-MMH-MML-HHH-MMM",
      desc: "你不是在玩卫戍协议，你是在追星。你推就是你的信仰，你推就是你的光，你推就是你在卫戍里存在的全部意义。什么运营效率、通关速度、版本强度——对不起，我推不在的局我不打。你就像一个带爱豆巡演的站姐，每个城市（每局游戏）都必须到场，就算你推只是在台上当背景板站了三分钟，你也能拍出九宫格精修图。旁人觉得你执念太深，你冷笑一声——懂什么，这叫爱。",
      slogan: "我推必须出场，规则算什么",
    },
    {
      code: "ZHXH",
      name: "空城流",
      group: "fan",
      emoji: "🤡",
      color: "#D946EF",
      img: "img/惊讶，啊？.png",
      vector: "MMM-MML-MMH-MMM-HHH",
      desc: "朋友，你不是在玩卫戍，你是在搞行为艺术。当所有人都在认真研究版本答案、冲分拿奖励的时候，你在研究怎么用五个三星凑一个从没触发过的冷门羁绊。别人眼中的废物体系，你眼中的待发掘宝藏。你的卫戍生涯就是一部翻车集锦，但你乐此不疲——因为你追求的从来不是胜利，而是那种「居然还能这样玩」的惊喜感。你是卫戍实验田里最快乐的小白鼠，翻车是你的勋章，整活是你的信仰。这个世界需要有人循规蹈矩地通关，也需要有人把规则撕了折纸飞机。",
      slogan: "赢不赢无所谓，整活才永恒",
    },
    {
      code: "TPHZ",
      name: "给给队",
      group: "bai",
      emoji: "🛋️",
      color: "#94A3B8",
      img: "img/好耶.png",
      vector: "LLL-HLL-LLL-LLL-LLL",
      desc: "你是社交场上的寄生虫——不对，是共生体。你深谙一个道理：为什么要自己扛，明明有人可以带我飞？你不是不会玩，你只是很早就参透了「努力的性价比」这个终极哲学问题。你是团队里的气氛组，赢了喊牛，输了加油，你的贡献不在数据面板上，在士气条上。有人说你是混子，你纠正一下——混子是混日子，你是混得有策略、有态度、有尊严。你是卫戍世界的VIP观众，前排落座，零食备齐，只为欣赏队友的精彩表演。",
      slogan: "我负责喊666，队友负责赢",
    },
    {
      code: "DLZS",
      name: "单机侠",
      group: "fan",
      emoji: "🐺",
      color: "#1E293B",
      img: "img/笑死.png",
      vector: "MHH-LLL-HHM-MHM-HHL",
      desc: "你的灵魂深处刻着四个大字：别来沾边。不是你不懂合作，是你合作过的队友配不上你的水平。联机模式在你眼里就是一场抢牌大会，与其跟一群不可控因素组队，不如一个人扛下所有。你选择最难的单人绝境模式，不是因为受虐倾向，是因为只有那种程度的挑战才配得上你的实力。你是卫戍世界的孤狼，月下独行的剑客，不需要队友，不需要观众，通关记录就是你最好的奖杯。有人说你孤僻，你只是微笑——弱者才需要抱团。",
      slogan: "单人通关才是真的厉害",
    },
    {
      code: "QPDD",
      name: "截胡怪",
      group: "gao",
      emoji: "🔒",
      color: "#475569",
      img: "img/ew眯眼腹黑坏笑.png",
      vector: "MMM-HMH-HML-MMM-MLH",
      desc: "你是联机局里的黑洞，卡牌经过你的手就别想再出去。你的眼睛像雷达一样扫描共享池，看到核心卡就条件反射地点锁，大脑甚至还没来得及思考「我到底用不用得上」。这是一种本能，像松鼠囤坚果，像龙守金库——你也不知道为什么要囤，但就是控制不住。你不是在玩卫戍，你是在玩一种名为「让你没牌可打」的meta游戏。别人的游戏目标是通关，你的游戏目标是让别人无法通关。有人说你损人不利己，你冷笑——让你难受就是我的收益。",
      slogan: "你的牌就是我的牌",
    },
    {
      code: "LCDS",
      name: "吃利息",
      group: "yun",
      emoji: "💹",
      color: "#10B981",
      img: "img/就这？.png",
      vector: "MMM-MMM-HLL-LLM-MMM",
      desc: "朋友，你不是在玩卫戍，你是在做财报表。别人打卫戍凭直觉，你打卫戍凭Excel。每回合的金币流向、升本ROI、刷牌期望值，都在你的脑海实时计算中。你是那种会为了省一块钱绕路三公里的人——在卫戍里也一样，算错一块钱的分配你可能当场就重开。有人说你太较真，你觉得他们太随便。在这个充满了随意升本、随手刷牌、随便买人的混乱世界里，你是唯一的秩序。你不是吝啬，你是敬畏每一分资源的价值。精打细算不是习惯，是你的世界观。",
      slogan: "算错一块钱直接重开",
    },
    {
      code: "PFKL",
      name: "氪佬",
      group: "chu",
      emoji: "✨",
      color: "#EC4899",
      img: "img/爱了爱了.png",
      vector: "MMM-MMM-MLM-HHH-MMM",
      desc: "你的消费逻辑很简单：好看=买，好用=买，又好看又好用=买两份。在卫戍的世界里，皮肤不只是装饰，它是你对干员的最高礼赞，是你在战场上建立的纪念碑。一个干员带你翻盘了？买皮肤。一个干员出新皮肤了？买。你甚至会给不常用的干员买皮肤，因为你相信——万一哪天用到了呢？你不是在消费，你是在投资感情。你的皮肤库存比你的实战经验还丰富，但你从不后悔，因为在你的价值观里，花钱给喜欢的东西从来不算浪费。",
      slogan: "谁带我赢我就给谁氪金",
    },
    {
      code: "GLXB",
      name: "抄作业",
      group: "yun",
      emoji: "📖",
      color: "#22C55E",
      img: "img/赞诶.png",
      vector: "MHH-MMM-HLM-MML-MHL",
      desc: "你的人生就是一篇不断修订的学术论文。别人打卫戍是来放松的，你是来做课题研究的。B站攻略区是你的文献库，大佬的运营视频是你的必读参考。你的浏览器收藏夹里全是攻略链接，手机相册里全是运营截图。你打每一局都像在做实验，目的是验证攻略的正确性，而不是享受游戏本身。有人说你活得太累，你摇摇头——当攻略的每一个细节都被你完美复刻的那一刻，那种学术上的满足感，是随机乱玩永远给不了的。",
      slogan: "新流派不玩明白不睡觉",
    },
    {
      code: "NBXZ",
      name: "反骨",
      group: "fan",
      emoji: "🏴",
      color: "#7C2D12",
      img: "img/博士生气.png",
      vector: "MHM-MML-MMH-MHM-HHH",
      desc: "你天生自带反骨。当全世界都在追捧同一个东西的时候，你的第一反应不是跟风，而是逆行。这不是叛逆期没过，这是你刻在骨子里的审美洁癖——大家都玩的东西一定是不酷的。你就像那个在KTV里所有人都在唱流行歌的时候，你非要点一首地下摇滚的人。在卫戍里，你的存在就是对抗版本答案的活体宣言。有人说你固执，有人说你装，但当你真的用冷门体系通关的那一刻，所有质疑都会变成沉默。你的信条是：大家都走的路一定不是最好的路，因为太挤了。",
      slogan: "版本强势？那多没意思",
    },
    {
      code: "KHXQ",
      name: "试毒人",
      group: "gan",
      emoji: "⚔️",
      color: "#F97316",
      img: "img/ew满头冷汗、瞳孔震惊.png",
      vector: "HHH-MMM-MHM-MHM-HHM",
      desc: "你是那种新车还没上市就想试驾的人。你的字典里没有「等别人先试」这五个字，新内容存在的意义就是被你第一时间打开、拆解、吃透。你是卫戍版本更新后的第一批小白鼠，也是第一批出攻略的大佬。你享受的不是通关本身，而是「在所有人之前搞明白」的那个过程。这种先驱者的快感，比任何游戏内奖励都让你上瘾。你就像一个永远在未知道路上狂奔的探险家，地图上还没画出来的区域，就是你的目的地。",
      slogan: "新东西必须我先玩明白",
    },
    {
      code: "BLDR",
      name: "摆烂区",
      group: "bai",
      emoji: "🦥",
      color: "#78716C",
      img: "img/彻底无语.png",
      vector: "LLL-MMM-LLL-LLL-LLL",
      desc: "朋友，你不是不努力，你只是很早就看透了「够用就好」这个宇宙真理。在这个人人都卷上限、比伤害、拼效率的卫戍世界里，你是唯一的底线守护者。你的目标从来不是打好，而是打完。奖励到手的那一刻，就是你这局卫戍的全部意义，多一秒都不想再投入。有人说你是摆烂，你纠正一下——这叫目标导向，叫效率最大化，叫不在没意义的事情上浪费生命。你是卫戍世界的极简主义者，断舍离大师，多余的运营和花里胡哨的操作，你统统不需要。",
      slogan: "能过就行，混完奖励拉倒",
    },
    {
      code: "DDDI",
      name: "区皇",
      group: "gao",
      emoji: "🛡️",
      color: "#14B8A6",
      img: "img/阿米娅瞪眼惊讶.png",
      vector: "MMM-HHM-HMH-MML-MML",
      desc: "你就是那个永远背着急救包的人。在任何团队里，你都自然而然地承担起「最后防线」的角色，不是因为你喜欢当英雄，而是因为你真的受不了看着团队输。队友崩了？你在。血线见底？你在。全队都以为要翻车了？别慌，看看我的满层体系。你享受那种力挽狂澜的瞬间——不是虚荣，是一种沉甸甸的成就感。你的存在让每一个和你组队的人都觉得安心，你是团队的定海神针，是风暴中最稳的那根柱子。世界需要英雄，而你从来不会缺席。",
      slogan: "有我在，这局就输不了",
    },
    {
      code: "FKKZ",
      name: "锁卡狂",
      group: "gao",
      emoji: "🚫",
      color: "#991B1B",
      img: "img/ew瞪眼咬牙.png",
      vector: "MMM-HML-HMM-HML-MML",
      desc: "你的安全感来自掌控。在联机的共享卡池里，你永远是最先锁卡的那个人，也是锁得最多的那个人。这不是贪婪，这是防御——你亲眼见过太多次核心卡被队友截胡的惨剧，所以你决定先下手为强。你的每局开局就像在布置防线，把所有关键卡牢牢锁住，让一切尽在掌握。有人说你疑心太重，你觉得他们天真。在这个弱肉强食的联机世界里，先锁的人才有资格谈和平。你不是不信任队友，你只是更相信自己。",
      slogan: "先锁为敬，谁也别想碰我的卡",
    },
    {
      code: "FUPN",
      name: "复盘怪",
      group: "yun",
      emoji: "🔍",
      color: "#0EA5E9",
      img: "img/阿米娅狡黠的调皮.png",
      vector: "MHM-MMM-HLM-MML-MML",
      desc: "你的记忆力好得吓人——不是记生日那种好，是记失误那种好。你能清楚地回忆起三天前那局在第7回合升本多花了一块钱、第12回合拿了张不该拿的牌。你不是在玩游戏，你是在做复盘报告。每一次失败在你眼里都不是浪费，是学费，而且你一定要把学费的价值榨干。有人输了就开下一把，你输了要先写三千字分析。你的卫戍生涯就是一部不断纠错的进化史，今天犯过的错，明天绝不会再犯。你不是完美主义者，你只是不允许自己白输。",
      slogan: "输了必须复盘，不能白输",
    },
    {
      code: "CDWJ",
      name: "考古党",
      group: "gan",
      emoji: "🥚",
      color: "#FBBF24",
      img: "img/思考中.png",
      vector: "HHM-MMM-MLM-MMH-MHM",
      desc: "别人玩卫戍是在通关，你玩卫戍是在考古。当所有人都在追求效率、速度、奖励的时候，你蹲在角落里研究一段莫名其妙的隐藏对话。你是那种会把游戏里每一面墙都敲一遍看看有没有密室的人。隐藏boss、特殊成就、没人发现的小细节——这些东西的存在就像是对你发出的邀请函，你不可能拒绝。你的卫戍通关次数比大多数人多三倍，但其中一半时间你根本不在打牌，而是在角落里找彩蛋。你不是在玩游戏，你是在和开发者玩捉迷藏，而且你每次都赢。",
      slogan: "彩蛋不全挖出来绝不收手",
    },
    {
      code: "PTTZ",
      name: "转职怪",
      group: "fan",
      emoji: "🔄",
      color: "#6366F1",
      img: "img/ew不敢相信的大受震撼.png",
      vector: "MMM-MML-MLH-MMM-MML",
      desc: "你的人生哲学只有六个字：识时务者为俊杰。当别人还在头铁坚持开局定的体系时，你已经叛逃三次了，而且每一次都叛逃得理直气壮。你打卫戍的方式像极了水——遇到障碍就绕过去，从来不会硬撞。这不是墙头草，这叫生存智慧。你是卫戍世界里最灵活的生物，什么体系都能玩，什么牌型都能转，唯一的信仰就是「什么顺玩什么」。规划是给死人定的，活人要懂得变通。你不是没有原则，你的原则就是没有原则——什么好用什么就是你的原则。",
      slogan: "见风使舵，什么顺玩什么",
    },
    {
      code: "STZS",
      name: "速通侠",
      group: "yun",
      emoji: "⚡",
      color: "#EAB308",
      img: "img/酷酷的.png",
      vector: "MHM-MMM-HHM-MML-MHH",
      desc: "你的人生信条是「快」——吃饭要快、走路要快、通关更要快。在卫戍里，你是那个永远在看计时器的人。别人在欣赏游戏画面，你在计算回合数。你为了缩短一个回合的通关时间，能同一套体系反复打三十遍，像个偏执的科学家一样不断调试每一个变量的最优解。叠层？彩蛋？整活？不好意思，这些都是阻碍你刷新记录的障碍物。你的卫戍生涯就是一场永无止境的自我超越，今天的极限只是明天的起点。你不是在玩游戏，你是在和自己赛跑。",
      slogan: "越快越好，刷新速通记录",
    },
    {
      code: "SCJK",
      name: "全图鉴",
      group: "gan",
      emoji: "📚",
      color: "#059669",
      img: "img/满眼盼着回应.png",
      vector: "HHH-MMM-MLH-HHH-MHM",
      desc: "你的卫戍账本上永远有一个未完成清单，而且这个清单比你的人生规划还详细。你不是一个简单的玩家，你是一个图鉴猎人，一个全成就强迫症，一个不把所有内容体验完就浑身难受的收藏家。某个羁绊特别难凑？那更要凑出来。某个阵营特别弱？那也要玩一遍。在你眼里，卫戍不是用来通关的，是用来收集的。就像一个执着的集邮者，缺一张邮票你的整本集邮册都不完整。你不是完美主义者，你只是一个不能容忍「未完成」三个字的强迫症。",
      slogan: "少一个都不算玩过卫戍",
    },
    {
      code: "WYBB",
      name: "必带党",
      group: "chu",
      emoji: "🌟",
      color: "#FCD34D",
      img: "img/满眼爱心.png",
      vector: "MMM-MML-MML-HHL-MML",
      desc: "你是那种去哪都要带一个特定玩偶出门的人。在卫戍里，这个玩偶就是你的本命干员。不管体系搭不搭、效率高不高、队友怎么看，你的助战位永远只属于他。他进去了可能什么都不做，就是个纯挂件，但你在看着他的时候会发自内心地笑。有人说这不理性，你觉得他们不懂——有些选择不需要理性，需要的是感情。你打卫戍不是为了赢，是为了和本命一起出现在同一个画面里。这叫什么？这叫陪伴。",
      slogan: "本命局局必带，当挂件也行",
    },
    {
      code: "SFPS",
      name: "随缘党",
      group: "bai",
      emoji: "🃏",
      color: "#8B5CF6",
      img: "img/眯眼软笑、脸颊鼓鼓，是温柔治愈.png",
      vector: "LLM-MMM-LLH-LLL-MML",
      desc: "朋友，你活得像一阵风——没有方向，但到处都是方向。你是卫戍世界里最佛系的存在，不规划、不纠结、不强求。发牌员给你什么牌，你就围绕什么牌玩，像水一样顺势而为。有人说你是在摆烂，你摇头——摆烂是消极，随缘是境界。你参透了卫戍的本质：这就是一个发牌游戏，你跟发牌员较什么劲呢？顺应天意，才能天人合一。你不是没有实力，你只是选择把命运交给概率，然后微笑着接受一切结果。你是卫戍禅宗大师，牌桌上的得道高僧。",
      slogan: "发牌给啥玩啥，顺应天意",
    },
    {
      code: "NTRD",
      name: "跨区执法",
      group: "gao",
      emoji: "😈",
      color: "#7C3AED",
      img: "img/ew眯眼撇嘴、满脸不屑.png",
      vector: "MMM-HHH-LHH-MMM-HML",
      desc: "你的占有欲不针对某件具体的物品，而是针对「别人正在享受的好东西」。你是那种看到朋友点了一份好吃的，自己那份还没到就忍不住先夹一筷子的人。联机时你的眼睛永远在扫描队友的牌面——他那个体系好顺啊，那张核心卡好想要啊。你的转体系速度比你的决策速度还快，而且每一次截胡都理所当然、心安理得。你不是坏人，你只是对「好东西必须被我拥有」这件事有一种近乎本能的执念。你的口头禅是：你的就是我的，我的还是我的。",
      slogan: "队友玩的，就是我要玩的",
    },
  ],

  specialTypes: [
    {
      code: "GLJL",
      name: "攻略大佬",
      emoji: "🏆",
      color: "#FF6B35",
      img: "img/ew张嘴开怀大笑.png",
      trigger: "guide",
      desc: "你不是在玩卫戍，你是在写卫戍的教科书。当所有人都在等着看别人的攻略时，你已经把新内容拆解完毕、写成教程、发到论坛了。无数人靠着你的轮椅攻略从零基础到稳定通关，你的名字就是卫戍攻略界的金字招牌。你享受的不仅是游戏本身，更是「教会别人」的成就感。你是卫戍世界里的老师、引路人、活地图。没有你的攻略，很多人的卫戍生涯会困难十倍。你不是在玩游戏，你在建设社区。",
      slogan: "我就是写攻略的那个大佬",
    },
    {
      code: "MYLZ",
      name: "电子斗蛐蛐",
      emoji: "🐟",
      color: "#06B6D4",
      img: "img/大哭.png",
      trigger: "fallback",
      desc: "标准人格库对你的卫戍脑回路集体罢工了！你玩卫戍没有固定套路，没有执着的体系，没有非要赢的执念。你像水一样不可预测——今天跟风玩T0，明天突然想整活，后天可能根本没打开游戏。你不是什么重度依赖，你只是一个碰巧在玩卫戍的乐子人。游戏对你来说就是电子榨菜，配饭用的，开心最重要。你是卫戍世界里最自由的存在，不受任何标签束缚，因为你自己都不知道下一把会打出什么操作。不确定性不是你的缺点，是你的魅力。",
      slogan: "玩卫戍，主打一个乐呵",
    },
  ],

  questions: [
    {
      dim: "A1",
      text: "你正在打卫戍，突然发现已经凌晨2点了，明天还要早起，你会？",
      options: [
        { label: "再打最后一把...然后就打到了4点", score: 3 },
        { label: "打完手里这把立刻睡", score: 2 },
        { label: "早就该睡了，我一般不会打到这么晚", score: 1 },
      ],
    },
    {
      dim: "A1",
      text: "朋友突然约你出去吃饭，但你卫戍的日常还没打完，你会？",
      options: [
        { label: "等我一下，打完这把就走", score: 3 },
        { label: "先把日常速刷完再出发", score: 2 },
        { label: "直接放下手机就走，游戏又不跑", score: 1 },
      ],
    },
    {
      dim: "A2",
      text: "一局卫戍打输了，你什么反应？",
      options: [
        { label: "必须看回放，把所有失误抠出来", score: 3 },
        { label: "有点不爽，开一把新的就好了", score: 2 },
        { label: "输了就输了，无所谓", score: 1 },
      ],
    },
    {
      dim: "A2",
      text: "你已经能稳定通关了，接下来会怎么做？",
      options: [
        { label: "继续研究怎么打得更完美，永无止境", score: 3 },
        { label: "试试有没有其他有趣的玩法", score: 2 },
        { label: "通关就行，不会再多花时间", score: 1 },
      ],
    },
    {
      dim: "A3",
      text: "卫戍更新了全新的盟约体系，你的第一反应是？",
      options: [
        { label: "第一时间冲进去，把所有新内容玩一遍", score: 3 },
        { label: "先看看别人怎么评价，有意思再试", score: 2 },
        { label: "等攻略出了再说，不着急当小白鼠", score: 1 },
      ],
    },
    {
      dim: "A3",
      text: "听说卫戍里有个隐藏彩蛋几乎没人触发过，你会？",
      options: [
        { label: "必须找出来！专门开好几把去触发它", score: 3 },
        { label: "打的时候顺便留意一下", score: 2 },
        { label: "彩蛋而已，不影响通关就行", score: 1 },
      ],
    },
    {
      dim: "S1",
      text: "今晚没朋友陪你玩卫戍，你会？",
      options: [
        { label: "去群里喊人，没人陪我玩不了一点", score: 3 },
        { label: "开个单人局凑合打一把", score: 2 },
        { label: "正好，一个人玩更清净", score: 1 },
      ],
    },
    {
      dim: "S1",
      text: "你觉得卫戍最核心的乐趣是什么？",
      options: [
        { label: "和朋友联机开黑，赢了输了都开心", score: 3 },
        { label: "研究运营，打出完美一局", score: 2 },
        { label: "都可以，看心情", score: 1 },
      ],
    },
    {
      dim: "S2",
      text: "联机时队友全部崩盘了，你怎么办？",
      options: [
        { label: "我来扛！养出强势体系一个人带飞全队", score: 3 },
        { label: "尽力配合队友，看能不能翻盘", score: 2 },
        { label: "这把没救了，躺平等下一把", score: 1 },
      ],
    },
    {
      dim: "S2",
      text: "组队的时候，你一般选什么定位？",
      options: [
        { label: "我来C，输出全靠我", score: 3 },
        { label: "看队伍缺什么我补什么", score: 2 },
        { label: "跟着队友混就好了", score: 1 },
      ],
    },
    {
      dim: "S3",
      text: "联机共享卡池里有张核心卡，你先看到了，会？",
      options: [
        { label: "先锁了！管我用不用，绝不给别人留", score: 3 },
        { label: "看心情，有时锁有时不锁", score: 2 },
        { label: "我体系需要就拿，不需要就留给队友", score: 1 },
      ],
    },
    {
      dim: "S3",
      text: "队友正在玩的体系很顺，核心卡都凑齐了，你会？",
      options: [
        {
          label: "直接转他那个体系抢核心卡，他能玩我也能玩",
          score: 3,
        },
        { label: "可能会蹭几张卡，但不会完全转", score: 2 },
        { label: "玩自己的体系，不眼馋别人的", score: 1 },
      ],
    },
    {
      dim: "T1",
      text: "你开局前会做什么准备？",
      options: [
        {
          label: "提前研究好攻略，定好要玩的体系和运营节奏",
          score: 3,
        },
        { label: "有个大概方向，但不完全固定", score: 2 },
        { label: "完全不做准备，开局再说", score: 1 },
      ],
    },
    {
      dim: "T1",
      text: "每回合结束金币要清空，你怎么规划花费？",
      options: [
        { label: "提前算好每一分钱的用途，精确到个位", score: 3 },
        { label: "大概规划一下，不会算太细", score: 2 },
        { label: "随便花，够用就行", score: 1 },
      ],
    },
    {
      dim: "T2",
      text: "手里攒了一笔钱，升本还是刷牌？",
      options: [
        { label: "全砸升本梭哈！赌出核心卡就天胡", score: 3 },
        { label: "大部分升本，留一点余量防意外", score: 2 },
        { label: "稳扎稳打，按攻略的节奏来", score: 1 },
      ],
    },
    {
      dim: "T2",
      text: "核心卡迟迟刷不出来，你怎么办？",
      options: [
        { label: "继续砸钱赌！这波不出核心我直接退游", score: 3 },
        { label: "再刷两轮，实在没有就转型", score: 2 },
        { label: "算了不勉强，换个思路一样能玩", score: 1 },
      ],
    },
    {
      dim: "T3",
      text: "你开局定的体系，发了10张牌一张都不给，你？",
      options: [
        {
          label: "立刻叛逃！什么顺玩什么，活人不能被牌憋死",
          score: 3,
        },
        { label: "再坚持几轮看看，实在不行再转", score: 2 },
        { label: "按原计划继续，不能半途而废", score: 1 },
      ],
    },
    {
      dim: "T3",
      text: "你选体系的思路是？",
      options: [
        { label: "从来不定体系，发牌给啥我就围绕啥玩", score: 3 },
        { label: "有个倾向，但随时可以换", score: 2 },
        { label: "定好了就不变，按规划走到底", score: 1 },
      ],
    },
    {
      dim: "E1",
      text: "开局随机ban阵营，刚好ban了你本命干员的阵营，你会？",
      options: [
        { label: "直接重开，本命不在还玩什么", score: 3 },
        { label: "有点不爽，用助战槽带本命凑合玩", score: 2 },
        { label: "无所谓，换个别的不就行了", score: 1 },
      ],
    },
    {
      dim: "E1",
      text: "当前体系和你本命干员完全不搭，你还会带他吗？",
      options: [
        { label: "必须带！当挂件也要塞进去看他一眼", score: 3 },
        { label: "看情况，严重影响通关就不带", score: 2 },
        { label: "不带，赢比什么都重要", score: 1 },
      ],
    },
    {
      dim: "E2",
      text: "一个干员刚出了超帅的新皮肤，但你不常用他，你会？",
      options: [
        { label: "买！好看就完事了，管他常用不常用", score: 3 },
        { label: "先看看特效，确实好看再入手", score: 2 },
        { label: "不常用的干员不买，浪费钱", score: 1 },
      ],
    },
    {
      dim: "E2",
      text: "这局一个干员带你逆风翻盘，你怎么报答他？",
      options: [
        { label: "立刻给他买皮肤，救命恩人必须氪金感谢", score: 3 },
        { label: "下把继续用他，以示感谢", score: 2 },
        { label: "翻盘靠的是运营，不关干员的事", score: 1 },
      ],
    },
    {
      dim: "E3",
      text: "已经能稳通关了，但差一张卡就能满羁绊，你？",
      options: [
        { label: "必须刷出来！差一张我都浑身难受", score: 3 },
        { label: "再打几把试试，出不来就算了", score: 2 },
        { label: "能通关就行，管他满不满", score: 1 },
      ],
    },
    {
      dim: "E3",
      text: "某个羁绊特别难凑，你从没成功过，你会？",
      options: [
        { label: "一定要凑出来！不成功绝不罢休", score: 3 },
        { label: "有机会就试，不强求", score: 2 },
        { label: "难凑就别凑了，玩简单的不香吗", score: 1 },
      ],
    },
    {
      dim: "G1",
      text: "你看到别人分享了一个超冷门的奇葩玩法，你会？",
      options: [
        { label: "立刻开一局试试！整活比通关有意思多了", score: 3 },
        { label: "看着挺有意思，有空试试", score: 2 },
        { label: "花里胡哨的，不如稳扎稳打靠谱", score: 1 },
      ],
    },
    {
      dim: "G1",
      text: "版本主流打法你都已经玩透了，接下来做什么？",
      options: [
        { label: "自己研究冷门玩法，整出新花样", score: 3 },
        { label: "看看有没有新攻略可以学", score: 2 },
        { label: "继续优化主流打法，精益求精", score: 1 },
      ],
    },
    {
      dim: "G2",
      text: "你玩卫戍最追求的是什么？",
      options: [
        { label: "速度！每局都要刷最快通关记录", score: 3 },
        { label: "效率适中，不影响拿奖励就行", score: 2 },
        { label: "慢慢来，享受过程比速度重要", score: 1 },
      ],
    },
    {
      dim: "G2",
      text: "能稳稳通关但慢，和冒险速通但可能翻车，你选哪个？",
      options: [
        { label: "速通！失败了就重开，怕什么", score: 3 },
        { label: "看心情，两种都可以", score: 2 },
        { label: "稳稳通关才是正道", score: 1 },
      ],
    },
    {
      dim: "G3",
      text: "全服都在玩版本T0体系，你呢？",
      options: [
        { label: "偏不！我就要玩冷门的，跟大流没意思", score: 3 },
        { label: "偶尔换换口味，但主要还是跟版本", score: 2 },
        { label: "T0确实强，有什么理由不玩呢", score: 1 },
      ],
    },
    {
      dim: "G3",
      text: "一个冷门体系突然被加强，变成版本答案了，你怎么看？",
      options: [
        { label: "完了，它不冷门了，瞬间失去兴趣", score: 3 },
        { label: "无所谓，我只关心哪个强玩哪个", score: 2 },
        { label: "正好，以前喜欢的体系终于能用了", score: 1 },
      ],
    },
  ],

  gateQuestion: {
    text: "玩卫戍协议的时候，你最喜欢做的事是？",
    options: [
      { label: "研究攻略打法", value: "guide" },
      { label: "和朋友联机开黑", value: "social" },
      { label: "尝试各种冷门玩法", value: "meme" },
      { label: "随便玩玩拿奖励", value: "casual" },
    ],
  },

  triggerQuestion: {
    text: "你会自己写攻略，分享给其他卫戍玩家吗？",
    options: [
      { label: "会，我经常自己写攻略发出去", value: "yes", trigger: "GLJL" },
      { label: "不会，我只看别人的攻略", value: "no" },
    ],
  },
};
