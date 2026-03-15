<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PhonePasswordResetController extends Controller
{
     /**
     * Send OTP for password reset
     */
    public function store(Request $request)
    {
        $request->merge([
            'phone' => $this->normalizeBDPhone($request->input('phone')),
        ]);

        $data = $request->validate([
            'phone' => ['required', 'regex:/^\+8801\d{9}$/'],
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX',
        ]);

        $user = User::where('phone', $data['phone'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'These credentials do not match our records.',
            ], 404);
        }

        if ($user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Admin password cannot be reset using this method.',
            ], 403);
        }

        $otp = (string) random_int(100000, 999999);
        $otpHash = Hash::make($otp);

        DB::table('phone_password_resets')->where('phone', $data['phone'])->delete();

        DB::table('phone_password_resets')->insert([
            'phone' => $data['phone'],
            'otp_hash' => $otpHash,
            'expires_at' => now()->addMinutes(5),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // TODO: এখানে SMS gateway integration করবে
        // উদাহরণ: SmsService::send($data['phone'], "Your OTP is {$otp}");

        logger()->info('Password reset OTP', [
            'phone' => $data['phone'],
            'otp' => $otp,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your phone.',
            'data' => [
                'phone' => $data['phone'],
                'expires_in_minutes' => 5,
            ],
        ], 200);
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->merge([
            'phone' => $this->normalizeBDPhone($request->input('phone')),
        ]);

        $data = $request->validate([
            'phone' => ['required', 'regex:/^\+8801\d{9}$/'],
            'otp' => ['required', 'digits:6'],
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX',
        ]);

        $row = DB::table('phone_password_resets')
            ->where('phone', $data['phone'])
            ->whereNull('used_at')
            ->orderByDesc('id')
            ->first();

        if (!$row) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        if (Carbon::parse($row->expires_at)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'OTP expired. Please request again.',
            ], 422);
        }

        if (!Hash::check($data['otp'], $row->otp_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully.',
        ], 200);
    }

    /**
     * Reset password using phone + OTP
     */
    public function update(Request $request)
    {
        $request->merge([
            'phone' => $this->normalizeBDPhone($request->input('phone')),
        ]);

        $data = $request->validate([
            'phone' => ['required', 'regex:/^\+8801\d{9}$/'],
            'otp' => ['required', 'digits:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX',
        ]);

        $row = DB::table('phone_password_resets')
            ->where('phone', $data['phone'])
            ->whereNull('used_at')
            ->orderByDesc('id')
            ->first();

        if (!$row) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        if (Carbon::parse($row->expires_at)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'OTP expired. Please request again.',
            ], 422);
        }

        if (!Hash::check($data['otp'], $row->otp_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP.',
            ], 422);
        }

        $user = User::where('phone', $data['phone'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Admin password cannot be reset using this method.',
            ], 403);
        }

        $user->password = Hash::make($data['password']);
        $user->save();

        DB::table('phone_password_resets')
            ->where('id', $row->id)
            ->update([
                'used_at' => now(),
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Password reset successful. Please log in.',
        ], 200);
    }

    /**
     * Normalize Bangladeshi phone number to +8801XXXXXXXXX
     */
    private function normalizeBDPhone($value): string
    {
        $phone = preg_replace('/[^\d+]/', '', (string) $value);

        if (str_starts_with($phone, '01')) {
            $phone = '+88' . $phone;
        } elseif (str_starts_with($phone, '880')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
