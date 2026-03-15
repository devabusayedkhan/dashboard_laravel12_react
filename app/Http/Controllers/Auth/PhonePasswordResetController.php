<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PhonePasswordResetController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/forgot-password', [
            'status' => session('status'),
        ]);
    }

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
            return back()->with('status', 'If the phone exists, we sent an OTP.');
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

        logger()->info('Password reset OTP', ['phone' => $data['phone'], 'otp' => $otp]);

        return redirect()->route('password.reset', ['phone' => $data['phone']])
            ->with('status', 'OTP sent to your phone.');
    }

    public function edit(Request $request)
    {
        return Inertia::render('auth/reset-password', [
            'phone' => $request->query('phone'),
            'status' => session('status'),
        ]);
    }

    public function update(Request $request)
    {
        $request->merge([
            'phone' => $this->normalizeBDPhone($request->input('phone')),
        ]);

        $data = $request->validate([
            'phone' => ['required', 'regex:/^\+8801\d{9}$/'],
            'otp' => ['required', 'digits:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $row = DB::table('phone_password_resets')
            ->where('phone', $data['phone'])
            ->whereNull('used_at')
            ->orderByDesc('id')
            ->first();

        if (!$row) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        }

        if (Carbon::parse($row->expires_at)->isPast()) {
            return back()->withErrors(['otp' => 'OTP expired. Please request again.']);
        }

        if (!Hash::check($data['otp'], $row->otp_hash)) {
            return back()->withErrors(['otp' => 'Invalid OTP.']);
        }

        $user = User::where('phone', $data['phone'])->first();
        if (!$user) {
            return back()->withErrors(['phone' => 'User not found.']);
        }

        $user->password = Hash::make($data['password']);
        $user->save();

        DB::table('phone_password_resets')->where('id', $row->id)->update([
            'used_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('login')->with('status', 'Password reset successful. Please log in.');
    }

    private function normalizeBDPhone($value): string
    {
        $phone = preg_replace('/[^\d+]/', '', (string) $value);

        if (str_starts_with($phone, '01')) $phone = '+88' . $phone;
        if (str_starts_with($phone, '880')) $phone = '+' . $phone;

        return $phone;
    }
}