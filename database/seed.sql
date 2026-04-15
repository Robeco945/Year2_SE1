USE messaging_app;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE messages;
TRUNCATE TABLE conversation_participants;
TRUNCATE TABLE conversations;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- USERS (10 users)
INSERT INTO users (username, email, password_hash) VALUES
('alice',   'alice@example.com',   'hash_alice'),
('bob',     'bob@example.com',     'hash_bob'),
('charlie', 'charlie@example.com', 'hash_charlie'),
('diana',   'diana@example.com',   'hash_diana'),
('eric',    'eric@example.com',    'hash_eric'),
('frank',   'frank@example.com',   'hash_frank'),
('grace',   'grace@example.com',   'hash_grace'),
('helen',   'helen@example.com',   'hash_helen'),
('ivan',    'ivan@example.com',    'hash_ivan'),
('julia',   'julia@example.com',   'hash_julia');

-- CONVERSATIONS (5 total: private + group)
INSERT INTO conversations (type) VALUES
('PRIVATE'),  -- id 1
('PRIVATE'),  -- id 2
('GROUP'),    -- id 3
('GROUP'),    -- id 4
('PRIVATE');  -- id 5

-- CONVERSATION PARTICIPANTS

-- Conversation 1 (private): alice & bob
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(1, 1),
(1, 2);

-- Conversation 2 (private): charlie & diana
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(2, 3),
(2, 4);

-- Conversation 3 (group): alice, bob, charlie
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(3, 1),
(3, 2),
(3, 3);

-- Conversation 4 (group): diana, eric, frank, grace
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(4, 4),
(4, 5),
(4, 6),
(4, 7);

-- Conversation 5 (private): ivan & julia
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(5, 9),
(5, 10);

-- MESSAGES (~15 messages total)

-- Conversation 1
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(1, 1, 'Hi Bob!'),
(1, 2, 'Hey Alice!'),
(1, 1, 'How is the project going?');

-- Conversation 2
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(2, 3, 'Hi Diana'),
(2, 4, 'Hey Charlie, what’s up?'),
(2, 3, 'Just checking in.');

-- Conversation 3
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(3, 1, 'Hello everyone'),
(3, 2, 'Hi Alice'),
(3, 3, 'Hey all'),
(3, 1, 'Let’s talk about the database');

-- Conversation 4
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(4, 4, 'Group chat started'),
(4, 5, 'Hi all'),
(4, 6, 'Hello'),
(4, 7, 'Nice to meet you');

-- Conversation 5
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(5, 9, 'Hi Julia'),
(5, 10, 'Hey Ivan');

TRUNCATE TABLE i18n_translations;
TRUNCATE TABLE i18n_keys;

-- I18N KEYS AND TRANSLATIONS (en/ar/ja)
INSERT INTO i18n_keys (key_name) VALUES
('app.brand'),
('app.cancel'),
('app.enterUserId'),
('app.enterValidUserId'),
('app.failedCreateConversation'),
('app.loadingConversations'),
('app.logout'),
('app.newMessageTitle'),
('app.openSettingsTitle'),
('app.settings'),
('app.start'),
('auth.alreadyHaveAccount'),
('auth.createAccount'),
('auth.creatingAccount'),
('auth.dontHaveAccount'),
('auth.email'),
('auth.loginFailed'),
('auth.password'),
('auth.signIn'),
('auth.signUp'),
('auth.signingIn'),
('auth.signupFailed'),
('auth.username'),
('conversation.empty'),
('conversation.header'),
('conversation.startConversation'),
('conversation.startNewConversationTitle'),
('conversation.table.activeConversation'),
('conversation.table.metric'),
('conversation.table.none'),
('conversation.table.today'),
('conversation.table.totalConversations'),
('conversation.table.value'),
('conversation.titleWithId'),
('conversation.type.group'),
('conversation.type.private'),
('language.arabic'),
('language.english'),
('language.japanese'),
('language.selectorLabel'),
('message.failedLoad'),
('message.failedSend'),
('message.inputPlaceholder'),
('message.loading'),
('message.noMessages'),
('message.selectConversation'),
('message.send'),
('message.userWithId'),
('profile.avatarAlt'),
('profile.bio'),
('profile.bioPlaceholder'),
('profile.changePassword'),
('profile.changingPassword'),
('profile.confirmNewPassword'),
('profile.currentPassword'),
('profile.displayName'),
('profile.displayNamePlaceholder'),
('profile.failedChangePassword'),
('profile.failedUpdateProfile'),
('profile.newPassword'),
('profile.passwordChangedSuccess'),
('profile.passwordMinLength'),
('profile.passwordMismatch'),
('profile.profilePicturePlaceholder'),
('profile.profilePictureUrl'),
('profile.profileUpdatedSuccess'),
('profile.saveChanges'),
('profile.saving'),
('profile.settings'),
('profile.tabPassword'),
('profile.tabProfile')
ON DUPLICATE KEY UPDATE key_name = VALUES(key_name);

INSERT INTO i18n_translations (i18n_key_id, locale, translation_text)
SELECT k.i18n_key_id, 'en', v.translation_text
FROM i18n_keys k
JOIN (
  SELECT 'app.brand' AS key_name, 'ChatApp' AS translation_text
  UNION ALL
  SELECT 'app.cancel' AS key_name, 'Cancel' AS translation_text
  UNION ALL
  SELECT 'app.enterUserId' AS key_name, 'Enter User ID:' AS translation_text
  UNION ALL
  SELECT 'app.enterValidUserId' AS key_name, 'Enter a valid user ID' AS translation_text
  UNION ALL
  SELECT 'app.failedCreateConversation' AS key_name, 'Failed to create conversation' AS translation_text
  UNION ALL
  SELECT 'app.loadingConversations' AS key_name, 'Loading conversations...' AS translation_text
  UNION ALL
  SELECT 'app.logout' AS key_name, 'Log out' AS translation_text
  UNION ALL
  SELECT 'app.newMessageTitle' AS key_name, 'New Message' AS translation_text
  UNION ALL
  SELECT 'app.openSettingsTitle' AS key_name, 'Open settings' AS translation_text
  UNION ALL
  SELECT 'app.settings' AS key_name, 'Settings' AS translation_text
  UNION ALL
  SELECT 'app.start' AS key_name, 'Start' AS translation_text
  UNION ALL
  SELECT 'auth.alreadyHaveAccount' AS key_name, 'Already have an account?' AS translation_text
  UNION ALL
  SELECT 'auth.createAccount' AS key_name, 'Create account' AS translation_text
  UNION ALL
  SELECT 'auth.creatingAccount' AS key_name, 'Creating account...' AS translation_text
  UNION ALL
  SELECT 'auth.dontHaveAccount' AS key_name, 'Don''t have an account?' AS translation_text
  UNION ALL
  SELECT 'auth.email' AS key_name, 'Email' AS translation_text
  UNION ALL
  SELECT 'auth.loginFailed' AS key_name, 'Login failed' AS translation_text
  UNION ALL
  SELECT 'auth.password' AS key_name, 'Password' AS translation_text
  UNION ALL
  SELECT 'auth.signIn' AS key_name, 'Sign in' AS translation_text
  UNION ALL
  SELECT 'auth.signUp' AS key_name, 'Sign up' AS translation_text
  UNION ALL
  SELECT 'auth.signingIn' AS key_name, 'Signing in...' AS translation_text
  UNION ALL
  SELECT 'auth.signupFailed' AS key_name, 'Sign up failed' AS translation_text
  UNION ALL
  SELECT 'auth.username' AS key_name, 'Username' AS translation_text
  UNION ALL
  SELECT 'conversation.empty' AS key_name, 'No conversations yet' AS translation_text
  UNION ALL
  SELECT 'conversation.header' AS key_name, 'Messages' AS translation_text
  UNION ALL
  SELECT 'conversation.startConversation' AS key_name, 'Start a conversation' AS translation_text
  UNION ALL
  SELECT 'conversation.startNewConversationTitle' AS key_name, 'Start new conversation' AS translation_text
  UNION ALL
  SELECT 'conversation.table.activeConversation' AS key_name, 'Active conversation' AS translation_text
  UNION ALL
  SELECT 'conversation.table.metric' AS key_name, 'Metric' AS translation_text
  UNION ALL
  SELECT 'conversation.table.none' AS key_name, 'None' AS translation_text
  UNION ALL
  SELECT 'conversation.table.today' AS key_name, 'Today' AS translation_text
  UNION ALL
  SELECT 'conversation.table.totalConversations' AS key_name, 'Total conversations' AS translation_text
  UNION ALL
  SELECT 'conversation.table.value' AS key_name, 'Value' AS translation_text
  UNION ALL
  SELECT 'conversation.titleWithId' AS key_name, 'Conversation #{{id}}' AS translation_text
  UNION ALL
  SELECT 'conversation.type.group' AS key_name, 'Group' AS translation_text
  UNION ALL
  SELECT 'conversation.type.private' AS key_name, 'Private' AS translation_text
  UNION ALL
  SELECT 'language.arabic' AS key_name, 'Arabic' AS translation_text
  UNION ALL
  SELECT 'language.english' AS key_name, 'English' AS translation_text
  UNION ALL
  SELECT 'language.japanese' AS key_name, 'Japanese' AS translation_text
  UNION ALL
  SELECT 'language.selectorLabel' AS key_name, 'Language' AS translation_text
  UNION ALL
  SELECT 'message.failedLoad' AS key_name, 'Failed to load messages' AS translation_text
  UNION ALL
  SELECT 'message.failedSend' AS key_name, 'Failed to send message' AS translation_text
  UNION ALL
  SELECT 'message.inputPlaceholder' AS key_name, 'Type a message...' AS translation_text
  UNION ALL
  SELECT 'message.loading' AS key_name, 'Loading...' AS translation_text
  UNION ALL
  SELECT 'message.noMessages' AS key_name, 'No messages yet. Say hello!' AS translation_text
  UNION ALL
  SELECT 'message.selectConversation' AS key_name, 'Select a conversation to start chatting' AS translation_text
  UNION ALL
  SELECT 'message.send' AS key_name, 'Send' AS translation_text
  UNION ALL
  SELECT 'message.userWithId' AS key_name, 'User {{id}}' AS translation_text
  UNION ALL
  SELECT 'profile.avatarAlt' AS key_name, 'Profile' AS translation_text
  UNION ALL
  SELECT 'profile.bio' AS key_name, 'Bio' AS translation_text
  UNION ALL
  SELECT 'profile.bioPlaceholder' AS key_name, 'Tell people about yourself...' AS translation_text
  UNION ALL
  SELECT 'profile.changePassword' AS key_name, 'Change Password' AS translation_text
  UNION ALL
  SELECT 'profile.changingPassword' AS key_name, 'Changing...' AS translation_text
  UNION ALL
  SELECT 'profile.confirmNewPassword' AS key_name, 'Confirm New Password' AS translation_text
  UNION ALL
  SELECT 'profile.currentPassword' AS key_name, 'Current Password' AS translation_text
  UNION ALL
  SELECT 'profile.displayName' AS key_name, 'Display Name' AS translation_text
  UNION ALL
  SELECT 'profile.displayNamePlaceholder' AS key_name, 'Your display name' AS translation_text
  UNION ALL
  SELECT 'profile.failedChangePassword' AS key_name, 'Failed to change password' AS translation_text
  UNION ALL
  SELECT 'profile.failedUpdateProfile' AS key_name, 'Failed to update profile' AS translation_text
  UNION ALL
  SELECT 'profile.newPassword' AS key_name, 'New Password' AS translation_text
  UNION ALL
  SELECT 'profile.passwordChangedSuccess' AS key_name, 'Password changed successfully' AS translation_text
  UNION ALL
  SELECT 'profile.passwordMinLength' AS key_name, 'Password must be at least 6 characters' AS translation_text
  UNION ALL
  SELECT 'profile.passwordMismatch' AS key_name, 'New passwords do not match' AS translation_text
  UNION ALL
  SELECT 'profile.profilePicturePlaceholder' AS key_name, 'https://example.com/photo.jpg' AS translation_text
  UNION ALL
  SELECT 'profile.profilePictureUrl' AS key_name, 'Profile Picture URL' AS translation_text
  UNION ALL
  SELECT 'profile.profileUpdatedSuccess' AS key_name, 'Profile updated successfully' AS translation_text
  UNION ALL
  SELECT 'profile.saveChanges' AS key_name, 'Save Changes' AS translation_text
  UNION ALL
  SELECT 'profile.saving' AS key_name, 'Saving...' AS translation_text
  UNION ALL
  SELECT 'profile.settings' AS key_name, 'Settings' AS translation_text
  UNION ALL
  SELECT 'profile.tabPassword' AS key_name, 'Password' AS translation_text
  UNION ALL
  SELECT 'profile.tabProfile' AS key_name, 'Profile' AS translation_text
) v ON v.key_name = k.key_name
UNION ALL
SELECT k.i18n_key_id, 'ar', v.translation_text
FROM i18n_keys k
JOIN (
  SELECT 'app.brand' AS key_name, 'تطبيق الدردشة' AS translation_text
  UNION ALL
  SELECT 'app.cancel' AS key_name, 'إلغاء' AS translation_text
  UNION ALL
  SELECT 'app.enterUserId' AS key_name, 'أدخل معرف المستخدم:' AS translation_text
  UNION ALL
  SELECT 'app.enterValidUserId' AS key_name, 'أدخل معرف مستخدم صحيحا' AS translation_text
  UNION ALL
  SELECT 'app.failedCreateConversation' AS key_name, 'فشل إنشاء المحادثة' AS translation_text
  UNION ALL
  SELECT 'app.loadingConversations' AS key_name, 'جاري تحميل المحادثات...' AS translation_text
  UNION ALL
  SELECT 'app.logout' AS key_name, 'تسجيل الخروج' AS translation_text
  UNION ALL
  SELECT 'app.newMessageTitle' AS key_name, 'رسالة جديدة' AS translation_text
  UNION ALL
  SELECT 'app.openSettingsTitle' AS key_name, 'فتح الإعدادات' AS translation_text
  UNION ALL
  SELECT 'app.settings' AS key_name, 'الإعدادات' AS translation_text
  UNION ALL
  SELECT 'app.start' AS key_name, 'بدء' AS translation_text
  UNION ALL
  SELECT 'auth.alreadyHaveAccount' AS key_name, 'لديك حساب بالفعل؟' AS translation_text
  UNION ALL
  SELECT 'auth.createAccount' AS key_name, 'إنشاء حساب' AS translation_text
  UNION ALL
  SELECT 'auth.creatingAccount' AS key_name, 'جاري إنشاء الحساب...' AS translation_text
  UNION ALL
  SELECT 'auth.dontHaveAccount' AS key_name, 'ليس لديك حساب؟' AS translation_text
  UNION ALL
  SELECT 'auth.email' AS key_name, 'البريد الإلكتروني' AS translation_text
  UNION ALL
  SELECT 'auth.loginFailed' AS key_name, 'فشل تسجيل الدخول' AS translation_text
  UNION ALL
  SELECT 'auth.password' AS key_name, 'كلمة المرور' AS translation_text
  UNION ALL
  SELECT 'auth.signIn' AS key_name, 'تسجيل الدخول' AS translation_text
  UNION ALL
  SELECT 'auth.signUp' AS key_name, 'إنشاء حساب' AS translation_text
  UNION ALL
  SELECT 'auth.signingIn' AS key_name, 'جاري تسجيل الدخول...' AS translation_text
  UNION ALL
  SELECT 'auth.signupFailed' AS key_name, 'فشل إنشاء الحساب' AS translation_text
  UNION ALL
  SELECT 'auth.username' AS key_name, 'اسم المستخدم' AS translation_text
  UNION ALL
  SELECT 'conversation.empty' AS key_name, 'لا توجد محادثات بعد' AS translation_text
  UNION ALL
  SELECT 'conversation.header' AS key_name, 'الرسائل' AS translation_text
  UNION ALL
  SELECT 'conversation.startConversation' AS key_name, 'ابدأ محادثة' AS translation_text
  UNION ALL
  SELECT 'conversation.startNewConversationTitle' AS key_name, 'بدء محادثة جديدة' AS translation_text
  UNION ALL
  SELECT 'conversation.table.activeConversation' AS key_name, 'المحادثة النشطة' AS translation_text
  UNION ALL
  SELECT 'conversation.table.metric' AS key_name, 'المؤشر' AS translation_text
  UNION ALL
  SELECT 'conversation.table.none' AS key_name, 'لا يوجد' AS translation_text
  UNION ALL
  SELECT 'conversation.table.today' AS key_name, 'اليوم' AS translation_text
  UNION ALL
  SELECT 'conversation.table.totalConversations' AS key_name, 'إجمالي المحادثات' AS translation_text
  UNION ALL
  SELECT 'conversation.table.value' AS key_name, 'القيمة' AS translation_text
  UNION ALL
  SELECT 'conversation.titleWithId' AS key_name, 'المحادثة رقم {{id}}' AS translation_text
  UNION ALL
  SELECT 'conversation.type.group' AS key_name, 'مجموعة' AS translation_text
  UNION ALL
  SELECT 'conversation.type.private' AS key_name, 'خاصة' AS translation_text
  UNION ALL
  SELECT 'language.arabic' AS key_name, 'العربية' AS translation_text
  UNION ALL
  SELECT 'language.english' AS key_name, 'الإنجليزية' AS translation_text
  UNION ALL
  SELECT 'language.japanese' AS key_name, 'اليابانية' AS translation_text
  UNION ALL
  SELECT 'language.selectorLabel' AS key_name, 'اللغة' AS translation_text
  UNION ALL
  SELECT 'message.failedLoad' AS key_name, 'فشل تحميل الرسائل' AS translation_text
  UNION ALL
  SELECT 'message.failedSend' AS key_name, 'فشل إرسال الرسالة' AS translation_text
  UNION ALL
  SELECT 'message.inputPlaceholder' AS key_name, 'اكتب رسالة...' AS translation_text
  UNION ALL
  SELECT 'message.loading' AS key_name, 'جاري التحميل...' AS translation_text
  UNION ALL
  SELECT 'message.noMessages' AS key_name, 'لا توجد رسائل بعد. ابدأ بالتحية!' AS translation_text
  UNION ALL
  SELECT 'message.selectConversation' AS key_name, 'اختر محادثة لبدء الدردشة' AS translation_text
  UNION ALL
  SELECT 'message.send' AS key_name, 'إرسال' AS translation_text
  UNION ALL
  SELECT 'message.userWithId' AS key_name, 'المستخدم {{id}}' AS translation_text
  UNION ALL
  SELECT 'profile.avatarAlt' AS key_name, 'الملف الشخصي' AS translation_text
  UNION ALL
  SELECT 'profile.bio' AS key_name, 'نبذة' AS translation_text
  UNION ALL
  SELECT 'profile.bioPlaceholder' AS key_name, 'أخبر الآخرين عنك...' AS translation_text
  UNION ALL
  SELECT 'profile.changePassword' AS key_name, 'تغيير كلمة المرور' AS translation_text
  UNION ALL
  SELECT 'profile.changingPassword' AS key_name, 'جاري التغيير...' AS translation_text
  UNION ALL
  SELECT 'profile.confirmNewPassword' AS key_name, 'تأكيد كلمة المرور الجديدة' AS translation_text
  UNION ALL
  SELECT 'profile.currentPassword' AS key_name, 'كلمة المرور الحالية' AS translation_text
  UNION ALL
  SELECT 'profile.displayName' AS key_name, 'اسم العرض' AS translation_text
  UNION ALL
  SELECT 'profile.displayNamePlaceholder' AS key_name, 'اسم العرض الخاص بك' AS translation_text
  UNION ALL
  SELECT 'profile.failedChangePassword' AS key_name, 'فشل تغيير كلمة المرور' AS translation_text
  UNION ALL
  SELECT 'profile.failedUpdateProfile' AS key_name, 'فشل تحديث الملف الشخصي' AS translation_text
  UNION ALL
  SELECT 'profile.newPassword' AS key_name, 'كلمة المرور الجديدة' AS translation_text
  UNION ALL
  SELECT 'profile.passwordChangedSuccess' AS key_name, 'تم تغيير كلمة المرور بنجاح' AS translation_text
  UNION ALL
  SELECT 'profile.passwordMinLength' AS key_name, 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل' AS translation_text
  UNION ALL
  SELECT 'profile.passwordMismatch' AS key_name, 'كلمتا المرور الجديدتان غير متطابقتين' AS translation_text
  UNION ALL
  SELECT 'profile.profilePicturePlaceholder' AS key_name, 'https://example.com/photo.jpg' AS translation_text
  UNION ALL
  SELECT 'profile.profilePictureUrl' AS key_name, 'رابط صورة الملف الشخصي' AS translation_text
  UNION ALL
  SELECT 'profile.profileUpdatedSuccess' AS key_name, 'تم تحديث الملف الشخصي بنجاح' AS translation_text
  UNION ALL
  SELECT 'profile.saveChanges' AS key_name, 'حفظ التغييرات' AS translation_text
  UNION ALL
  SELECT 'profile.saving' AS key_name, 'جاري الحفظ...' AS translation_text
  UNION ALL
  SELECT 'profile.settings' AS key_name, 'الإعدادات' AS translation_text
  UNION ALL
  SELECT 'profile.tabPassword' AS key_name, 'كلمة المرور' AS translation_text
  UNION ALL
  SELECT 'profile.tabProfile' AS key_name, 'الملف الشخصي' AS translation_text
) v ON v.key_name = k.key_name
UNION ALL
SELECT k.i18n_key_id, 'ja', v.translation_text
FROM i18n_keys k
JOIN (
  SELECT 'app.brand' AS key_name, 'チャットアプリ' AS translation_text
  UNION ALL
  SELECT 'app.cancel' AS key_name, 'キャンセル' AS translation_text
  UNION ALL
  SELECT 'app.enterUserId' AS key_name, 'ユーザーIDを入力:' AS translation_text
  UNION ALL
  SELECT 'app.enterValidUserId' AS key_name, '有効なユーザーIDを入力してください' AS translation_text
  UNION ALL
  SELECT 'app.failedCreateConversation' AS key_name, '会話の作成に失敗しました' AS translation_text
  UNION ALL
  SELECT 'app.loadingConversations' AS key_name, '会話を読み込み中...' AS translation_text
  UNION ALL
  SELECT 'app.logout' AS key_name, 'ログアウト' AS translation_text
  UNION ALL
  SELECT 'app.newMessageTitle' AS key_name, '新しいメッセージ' AS translation_text
  UNION ALL
  SELECT 'app.openSettingsTitle' AS key_name, '設定を開く' AS translation_text
  UNION ALL
  SELECT 'app.settings' AS key_name, '設定' AS translation_text
  UNION ALL
  SELECT 'app.start' AS key_name, '開始' AS translation_text
  UNION ALL
  SELECT 'auth.alreadyHaveAccount' AS key_name, 'すでにアカウントをお持ちですか？' AS translation_text
  UNION ALL
  SELECT 'auth.createAccount' AS key_name, 'アカウント作成' AS translation_text
  UNION ALL
  SELECT 'auth.creatingAccount' AS key_name, 'アカウント作成中...' AS translation_text
  UNION ALL
  SELECT 'auth.dontHaveAccount' AS key_name, 'アカウントをお持ちでないですか？' AS translation_text
  UNION ALL
  SELECT 'auth.email' AS key_name, 'メール' AS translation_text
  UNION ALL
  SELECT 'auth.loginFailed' AS key_name, 'サインインに失敗しました' AS translation_text
  UNION ALL
  SELECT 'auth.password' AS key_name, 'パスワード' AS translation_text
  UNION ALL
  SELECT 'auth.signIn' AS key_name, 'サインイン' AS translation_text
  UNION ALL
  SELECT 'auth.signUp' AS key_name, '登録' AS translation_text
  UNION ALL
  SELECT 'auth.signingIn' AS key_name, 'サインイン中...' AS translation_text
  UNION ALL
  SELECT 'auth.signupFailed' AS key_name, '登録に失敗しました' AS translation_text
  UNION ALL
  SELECT 'auth.username' AS key_name, 'ユーザー名' AS translation_text
  UNION ALL
  SELECT 'conversation.empty' AS key_name, '会話はまだありません' AS translation_text
  UNION ALL
  SELECT 'conversation.header' AS key_name, 'メッセージ' AS translation_text
  UNION ALL
  SELECT 'conversation.startConversation' AS key_name, '会話を開始' AS translation_text
  UNION ALL
  SELECT 'conversation.startNewConversationTitle' AS key_name, '新しい会話を開始' AS translation_text
  UNION ALL
  SELECT 'conversation.table.activeConversation' AS key_name, '現在の会話' AS translation_text
  UNION ALL
  SELECT 'conversation.table.metric' AS key_name, '項目' AS translation_text
  UNION ALL
  SELECT 'conversation.table.none' AS key_name, 'なし' AS translation_text
  UNION ALL
  SELECT 'conversation.table.today' AS key_name, '今日' AS translation_text
  UNION ALL
  SELECT 'conversation.table.totalConversations' AS key_name, '会話数' AS translation_text
  UNION ALL
  SELECT 'conversation.table.value' AS key_name, '値' AS translation_text
  UNION ALL
  SELECT 'conversation.titleWithId' AS key_name, '会話 #{{id}}' AS translation_text
  UNION ALL
  SELECT 'conversation.type.group' AS key_name, 'グループ' AS translation_text
  UNION ALL
  SELECT 'conversation.type.private' AS key_name, '個別' AS translation_text
  UNION ALL
  SELECT 'language.arabic' AS key_name, 'アラビア語' AS translation_text
  UNION ALL
  SELECT 'language.english' AS key_name, '英語' AS translation_text
  UNION ALL
  SELECT 'language.japanese' AS key_name, '日本語' AS translation_text
  UNION ALL
  SELECT 'language.selectorLabel' AS key_name, '言語' AS translation_text
  UNION ALL
  SELECT 'message.failedLoad' AS key_name, 'メッセージの読み込みに失敗しました' AS translation_text
  UNION ALL
  SELECT 'message.failedSend' AS key_name, 'メッセージの送信に失敗しました' AS translation_text
  UNION ALL
  SELECT 'message.inputPlaceholder' AS key_name, 'メッセージを入力...' AS translation_text
  UNION ALL
  SELECT 'message.loading' AS key_name, '読み込み中...' AS translation_text
  UNION ALL
  SELECT 'message.noMessages' AS key_name, 'まだメッセージがありません。挨拶してみましょう。' AS translation_text
  UNION ALL
  SELECT 'message.selectConversation' AS key_name, '会話を選択してチャットを開始してください' AS translation_text
  UNION ALL
  SELECT 'message.send' AS key_name, '送信' AS translation_text
  UNION ALL
  SELECT 'message.userWithId' AS key_name, 'ユーザー {{id}}' AS translation_text
  UNION ALL
  SELECT 'profile.avatarAlt' AS key_name, 'プロフィール' AS translation_text
  UNION ALL
  SELECT 'profile.bio' AS key_name, '自己紹介' AS translation_text
  UNION ALL
  SELECT 'profile.bioPlaceholder' AS key_name, 'あなたについて書いてください...' AS translation_text
  UNION ALL
  SELECT 'profile.changePassword' AS key_name, 'パスワードを変更' AS translation_text
  UNION ALL
  SELECT 'profile.changingPassword' AS key_name, '変更中...' AS translation_text
  UNION ALL
  SELECT 'profile.confirmNewPassword' AS key_name, '新しいパスワードを確認' AS translation_text
  UNION ALL
  SELECT 'profile.currentPassword' AS key_name, '現在のパスワード' AS translation_text
  UNION ALL
  SELECT 'profile.displayName' AS key_name, '表示名' AS translation_text
  UNION ALL
  SELECT 'profile.displayNamePlaceholder' AS key_name, '表示名を入力' AS translation_text
  UNION ALL
  SELECT 'profile.failedChangePassword' AS key_name, 'パスワードの変更に失敗しました' AS translation_text
  UNION ALL
  SELECT 'profile.failedUpdateProfile' AS key_name, 'プロフィールの更新に失敗しました' AS translation_text
  UNION ALL
  SELECT 'profile.newPassword' AS key_name, '新しいパスワード' AS translation_text
  UNION ALL
  SELECT 'profile.passwordChangedSuccess' AS key_name, 'パスワードを変更しました' AS translation_text
  UNION ALL
  SELECT 'profile.passwordMinLength' AS key_name, 'パスワードは6文字以上である必要があります' AS translation_text
  UNION ALL
  SELECT 'profile.passwordMismatch' AS key_name, '新しいパスワードが一致しません' AS translation_text
  UNION ALL
  SELECT 'profile.profilePicturePlaceholder' AS key_name, 'https://example.com/photo.jpg' AS translation_text
  UNION ALL
  SELECT 'profile.profilePictureUrl' AS key_name, 'プロフィール画像URL' AS translation_text
  UNION ALL
  SELECT 'profile.profileUpdatedSuccess' AS key_name, 'プロフィールを更新しました' AS translation_text
  UNION ALL
  SELECT 'profile.saveChanges' AS key_name, '変更を保存' AS translation_text
  UNION ALL
  SELECT 'profile.saving' AS key_name, '保存中...' AS translation_text
  UNION ALL
  SELECT 'profile.settings' AS key_name, '設定' AS translation_text
  UNION ALL
  SELECT 'profile.tabPassword' AS key_name, 'パスワード' AS translation_text
  UNION ALL
  SELECT 'profile.tabProfile' AS key_name, 'プロフィール' AS translation_text
) v ON v.key_name = k.key_name
ON DUPLICATE KEY UPDATE translation_text = VALUES(translation_text);

