import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: Request,
  { params }: { params: { skillId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const skill = await db.skill.findUnique({
      where: {
        id: params.skillId,
        isPublished: true,
      }
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId: params.skillId
        }
      }
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!skill) {
      return new NextResponse("Not found", { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "AUD",
          product_data: {
            name: skill.title,
            description: skill.description!,
          },
          unit_amount: Math.round(skill.price! * 100),
        }
      }
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      }
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: String(stripeCustomer.stripeCustomerId),
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/skills/${skill.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/skills/${skill.id}?canceled=1`,
      metadata: {
        skillId: skill.id,
        userId: user.id,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[SKILL_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}